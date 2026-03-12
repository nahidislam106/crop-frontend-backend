import pandas as pd
import random

crops = [
    "balsam apple",
    "cauliflower",
    "chili",
    "cucumber"
]

data = []

for crop in crops:
    for i in range(100):   
        temperature = round(random.uniform(11, 28),2)
        humidity = round(random.uniform(47, 96),2)
        light_intensity = round(random.uniform(100, 1000),2)
        air_pressure = round(random.uniform(980, 1030),2)
        rainfall = round(random.uniform(0, 30),2)

        data.append([
            temperature,
            humidity,
            light_intensity,
            air_pressure,
            rainfall,
            crop
        ])

df = pd.DataFrame(data, columns=[
    "temperature",
    "humidity",
    "light_intensity",
    "air_pressure",
    "rainfall",
    "label"
])

df.to_csv("data_2.csv", index=False)

print("data.csv generated successfully")
