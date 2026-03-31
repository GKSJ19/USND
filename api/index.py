from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This must match the fetch URL exactly
@app.get("/data")
@app.get("/api/data")
def get_data():
    try:
        # Get the path to the data folder at the root
        base_dir = os.getcwd()
        file_path = os.path.join(base_dir, "data", "us_disaster_declarations.csv")

        if not os.path.exists(file_path):
            return {"error": f"File not found at {file_path}. Check if 'data' folder is uploaded."}

        df = pd.read_csv(file_path, encoding="latin1", nrows=200)
        df = df.fillna("")

        return df.to_dict(orient="records")

    except Exception as e:
        return {"error": str(e)}