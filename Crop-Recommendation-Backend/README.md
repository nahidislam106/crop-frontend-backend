# Crop Recommendation System API

Machine learning-powered REST API for intelligent crop recommendation based on soil and environmental parameters. Built with FastAPI and scikit-learn.

## Features

- **Crop Prediction**: ML-based crop recommendation from 12 soil and environmental features
- **Ideal Parameters**: Statistical analysis of optimal growing conditions per crop
- **Production-Ready**: Designed for deployment on Render with environment-based configuration
- **Auto Documentation**: Interactive API docs via FastAPI's built-in Swagger UI

## Tech Stack

- **Framework**: FastAPI 0.109.0
- **ML**: scikit-learn 1.4.0, joblib
- **Server**: Uvicorn with ASGI support
- **Data**: pandas, numpy
- **Python**: 3.10+

## API Endpoints

### `POST /predict`
Recommends optimal crop based on input parameters.

**Input Features** (12): N, P, K, temperature, humidity, ph, EC, weather_temperature, weather_humidity, light_intensity, air_pressure, rainfall

**Response**: Crop name, confidence score, model info

### `GET /ideal-parameters/{crop_name}`
Returns statistical distribution of ideal growing conditions for specified crop.

**Response**: Mean, std, min, max, median values for all parameters

### `GET /health`
Health check endpoint with model load status

### `GET /docs`
Interactive API documentation

## Deployment

### Render Configuration

```yaml
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | * |

### Directory Structure

```
backend/
├── main.py                                    # FastAPI application
├── requirements.txt                           # Python dependencies
├── Model for crop recommendation system/      # ML model files
│   ├── best_crop_model_joblib.pkl
│   ├── scaler_joblib.pkl
│   └── model_info.pkl
└── Model for soil parameters by selecting crop/
    └── ideal_parameters.json                  # Crop parameter statistics
```

## Local Development

```bash
pip install -r requirements.txt
python main.py
```

Access at: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

## Model Architecture

- **Algorithm**: Random Forest Classifier (or configured model)
- **Input Features**: 12 normalized environmental and soil parameters  
- **Preprocessing**: StandardScaler for feature normalization
- **Output**: Multi-class crop classification with probability scores

## License

MIT License
