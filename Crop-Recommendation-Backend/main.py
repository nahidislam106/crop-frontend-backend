from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from contextlib import asynccontextmanager
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any
import logging
from pathlib import Path
import json
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

model = None
scaler = None
model_info = None
feature_names = None
ideal_parameters = None
label_classes = None  # Ordered crop names matching LabelEncoder used during training

EXPECTED_FEATURES = [
    'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'EC',
    'weather_temperature', 'weather_humidity', 'light_intensity',
    'air_pressure', 'rainfall'
]

class CropInput(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "N": 90,
                "P": 42,
                "K": 43,
                "temperature": 20.88,
                "humidity": 82.0,
                "ph": 6.5,
                "EC": 3.36,
                "weather_temperature": 20.31,
                "weather_humidity": 63.72,
                "light_intensity": 381.97,
                "air_pressure": 997.77,
                "rainfall": 2.64
            }
        }
    )
    
    N: float = Field(..., description="Nitrogen content in soil (kg/ha)", ge=0, le=200)
    P: float = Field(..., description="Phosphorus content in soil (kg/ha)", ge=0, le=200)
    K: float = Field(..., description="Potassium content in soil (kg/ha)", ge=0, le=200)
    temperature: float = Field(..., description="Temperature (°C)", ge=-10, le=50)
    humidity: float = Field(..., description="Humidity (%)", ge=0, le=100)
    ph: float = Field(..., description="Soil pH value", ge=0, le=14)
    EC: float = Field(..., description="Electrical Conductivity (dS/m)", ge=0, le=10)
    weather_temperature: float = Field(..., description="Weather temperature (°C)", ge=-10, le=50)
    weather_humidity: float = Field(..., description="Weather humidity (%)", ge=0, le=100)
    light_intensity: float = Field(..., description="Light intensity (lux)", ge=0, le=2000)
    air_pressure: float = Field(..., description="Air pressure (hPa)", ge=900, le=1100)
    rainfall: float = Field(..., description="Rainfall (mm)", ge=0, le=500)

class CropPrediction(BaseModel):
    recommended_crop: str
    confidence: float
    model_name: str
    input_features: Dict[str, float]
    
class HealthCheck(BaseModel):
    status: str
    model_loaded: bool
    scaler_loaded: bool
    ideal_parameters_loaded: bool
    total_crops: int
    model_info: Dict[str, Any]

class IdealParameterValue(BaseModel):
    mean: float
    std: float
    min: float
    max: float
    median: float

class CropIdealParameters(BaseModel):
    crop: str
    parameters: Dict[str, IdealParameterValue]

def load_models():
    global model, scaler, model_info, feature_names, ideal_parameters, label_classes

    try:
        base_dir = Path(__file__).parent
        model_dir = base_dir / "Model for crop recommendation system"
        ideal_params_dir = base_dir / "Model for soil parameters by selecting crop"

        model_path = model_dir / "best_crop_model_joblib.pkl"
        if not model_path.exists():
            model_path = model_dir / "best_crop_model.pkl"
        logger.info(f"Loading model from: {model_path}")
        model = joblib.load(model_path)
        logger.info(f"Model loaded: {type(model).__name__}")

        scaler_path = model_dir / "scaler_joblib.pkl"
        if not scaler_path.exists():
            scaler_path = model_dir / "scaler.pkl"
        scaler = joblib.load(scaler_path)
        logger.info("Scaler loaded")

        model_info_path = model_dir / "model_info.pkl"
        if model_info_path.exists():
            try:
                model_info = joblib.load(model_info_path)
            except Exception as e:
                logger.warning(f"Could not load model info: {e}")
                model_info = {"model_name": type(model).__name__}
        else:
            model_info = {"model_name": type(model).__name__}

        ideal_params_path = ideal_params_dir / "ideal_parameters.json"
        if ideal_params_path.exists():
            try:
                with open(ideal_params_path, "r") as f:
                    ideal_parameters = json.load(f)
                logger.info(f"Ideal parameters loaded: {len(ideal_parameters)} crops")
            except Exception as e:
                logger.warning(f"Could not load ideal parameters: {e}")
                ideal_parameters = {}
        else:
            ideal_params_pkl_path = ideal_params_dir / "ideal_parameters.pkl"
            if ideal_params_pkl_path.exists():
                try:
                    ideal_parameters = joblib.load(ideal_params_pkl_path)
                    logger.info(f"Ideal parameters loaded from pickle: {len(ideal_parameters)} crops")
                except Exception as e:
                    logger.warning(f"Could not load ideal parameters from pickle: {e}")
                    ideal_parameters = {}
            else:
                logger.warning("Ideal parameters file not found")
                ideal_parameters = {}

        feature_names = EXPECTED_FEATURES

        # Build label class list matching the LabelEncoder order (alphabetically sorted)
        dataset_paths = [
            base_dir / "others" / "useable_dataset - useable_dataset.csv",
            base_dir / "others" / "data.csv",
            base_dir / "others" / "data_2.csv",
        ]
        loaded_from_csv = False
        for dp in dataset_paths:
            if dp.exists():
                try:
                    df = pd.read_csv(dp)
                    if "crop" in df.columns:
                        label_classes = sorted(df["crop"].dropna().unique().tolist())
                        logger.info(f"Label classes loaded from CSV: {label_classes}")
                        loaded_from_csv = True
                        break
                except Exception as e:
                    logger.warning(f"Could not read crop labels from {dp}: {e}")
        if not loaded_from_csv:
            label_classes = [
                "Balsam Apple", "Cauliflower", "Chili", "Cucumber",
                "apple", "banana", "blackgram", "chickpea", "coconut",
                "coffee", "cotton", "grapes", "jute", "kidneybeans",
                "lentil", "maize", "mango", "mothbeans", "mungbean",
                "muskmelon", "orange", "papaya", "pigeonpeas",
                "pomegranate", "rice", "watermelon",
            ]
            logger.warning("Using hardcoded label classes (CSV not found)")

    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Crop Recommendation API...")
    load_models()
    logger.info("API ready")
    yield
    logger.info("Shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Crop Recommendation System API",
    description="Machine Learning API for crop recommendation based on soil and environmental parameters",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Crop Recommendation System API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "POST /predict - Get crop recommendation from parameters",
            "ideal_parameters": "GET /ideal-parameters/{crop_name} - Get ideal parameters for a crop",
        },
        "docs": "/docs",
    }

@app.get("/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    ideal_params_loaded = ideal_parameters is not None and len(ideal_parameters) > 0
    all_loaded = model is not None and scaler is not None and ideal_params_loaded
    return HealthCheck(
        status="healthy" if all_loaded else "partially healthy" if model is not None else "unhealthy",
        model_loaded=model is not None,
        scaler_loaded=scaler is not None,
        ideal_parameters_loaded=ideal_params_loaded,
        total_crops=len(ideal_parameters) if ideal_parameters else 0,
        model_info=model_info if model_info else {},
    )

@app.post("/predict", response_model=CropPrediction, tags=["Prediction"])
async def predict_crop(crop_input: CropInput):
    """Predict the recommended crop based on soil and environmental parameters."""
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        input_dict = crop_input.dict()
        input_df = pd.DataFrame([input_dict], columns=EXPECTED_FEATURES)
        logger.info(f"Prediction request: {input_dict}")

        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)[0]

        # Decode numeric label to crop name using the sorted LabelEncoder mapping
        if isinstance(prediction, (int, np.integer)) and label_classes:
            crop_name = label_classes[int(prediction)]
        elif hasattr(prediction, "item"):
            raw = prediction.item()
            crop_name = label_classes[int(raw)] if label_classes and isinstance(raw, int) else str(prediction)
        else:
            crop_name = str(prediction)

        if hasattr(model, "predict_proba"):
            confidence = float(max(model.predict_proba(input_scaled)[0]))
        else:
            confidence = 1.0

        logger.info(f"Prediction: {crop_name}, Confidence: {confidence}")

        return CropPrediction(
            recommended_crop=crop_name,
            confidence=confidence,
            model_name=model_info.get("model_name", type(model).__name__),
            input_features=input_dict,
        )

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model/info", tags=["Model"])
async def get_model_info():
    """Return metadata about the loaded ML model."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "model_type": type(model).__name__,
        "features": EXPECTED_FEATURES,
        "num_features": len(EXPECTED_FEATURES),
        "model_info": model_info if model_info else {},
    }


@app.get("/features", tags=["Model"])
async def get_features():
    """List expected input features and their valid ranges."""
    feature_descriptions = {
        "N": "Nitrogen content in soil (kg/ha) - Range: 0-200",
        "P": "Phosphorus content in soil (kg/ha) - Range: 0-200",
        "K": "Potassium content in soil (kg/ha) - Range: 0-200",
        "temperature": "Temperature (°C) - Range: -10 to 50",
        "humidity": "Humidity (%) - Range: 0-100",
        "ph": "Soil pH value - Range: 0-14",
        "EC": "Electrical Conductivity (dS/m) - Range: 0-10",
        "weather_temperature": "Weather temperature (°C) - Range: -10 to 50",
        "weather_humidity": "Weather humidity (%) - Range: 0-100",
        "light_intensity": "Light intensity (lux) - Range: 0-2000",
        "air_pressure": "Air pressure (hPa) - Range: 900-1100",
        "rainfall": "Rainfall (mm) - Range: 0-500",
    }
    return {
        "features": EXPECTED_FEATURES,
        "descriptions": feature_descriptions,
        "total_features": len(EXPECTED_FEATURES),
    }


@app.get("/ideal-parameters/{crop_name}", response_model=CropIdealParameters, tags=["Reverse Prediction"])
async def get_ideal_parameters_for_crop(crop_name: str):
    """Get ideal soil and environmental parameters for a specific crop."""
    if ideal_parameters is None or len(ideal_parameters) == 0:
        raise HTTPException(status_code=503, detail="Ideal parameters data not loaded")

    # Case-insensitive lookup
    lower_map = {k.lower().replace(" ", ""): k for k in ideal_parameters.keys()}
    lower_map_spaced = {k.lower(): k for k in ideal_parameters.keys()}
    normalized = crop_name.lower().replace(" ", "")
    original_key = lower_map.get(normalized) or lower_map_spaced.get(crop_name.lower())

    if original_key is None:
        raise HTTPException(
            status_code=404,
            detail=f"Crop '{crop_name}' not found. Available crops: {sorted(ideal_parameters.keys())}",
        )

    parameters = {
        param: IdealParameterValue(**values)
        for param, values in ideal_parameters[original_key].items()
    }
    logger.info(f"Retrieved ideal parameters for: {original_key}")
    return CropIdealParameters(crop=original_key, parameters=parameters)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
