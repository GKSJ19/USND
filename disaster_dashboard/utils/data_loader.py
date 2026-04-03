import pandas as pd

def load_data():
    df = pd.read_csv("disaster_dashboard/usnd_cleaned.csv")   # use your actual file
    return df