from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib

# Load the model
model = joblib.load("titanic_model.pkl")

# Create app instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input schema
class Passenger(BaseModel):
    Pclass: int
    Sex: str  # 'male' or 'female'
    Age: float
    SibSp: int
    Parch: int
    Fare: float
    Embarked: str  # 'C', 'Q', or 'S'

@app.post("/predict")
def predict(passenger: Passenger):
    df = pd.DataFrame([passenger.dict()])

    # Manual preprocessing (same as training)
    df["Sex"] = 1 if df["Sex"][0] == "male" else 0
    embarked_map = {"C": 0, "Q": 1, "S": 2}
    df["Embarked"] = df["Embarked"].map(embarked_map)

    # Predict
    prediction = model.predict(df)[0]
    return {"survived": int(prediction)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=10000, reload=True)
