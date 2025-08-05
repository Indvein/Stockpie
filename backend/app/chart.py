from fastapi import APIRouter , Query
import pandas as pd
import os
import numpy as np

router = APIRouter()

@router.get("/real-values-history")
def get_real_values_history(company: str = Query("APPLE", description="Company name")):
    base_path = os.path.dirname(__file__)
    company = company.upper()

    # Map display names to lowercase filenames
    filename_map = {
        "APPLE": "apple",
        "MICROSOFT": "microsoft",
        "GOOGLE": "google",
        "TESLA": "tesla",
        "NVIDIA": "nvidia",
    }

    if company not in filename_map:
        return {"error": "Invalid company name."}

    # Build file path for real values
    real_values_path = os.path.join(base_path, "data", f"{filename_map[company]}_real_values.csv")

    if not os.path.exists(real_values_path):
        return {"error": f"CSV file for {company} not found."}

    # Read CSV
    df = pd.read_csv(real_values_path, usecols=["Date", "Close"])

    # Format date
    df["Date"] = pd.to_datetime(df["Date"])
    df.sort_values("Date", inplace=True)
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Replace NaNs with None for JSON
    df.replace([np.nan, pd.NA, pd.NaT], None, inplace=True)

    return df.to_dict(orient="records")



@router.get("/combined-chart-data")
def get_combined_chart_data(company: str = Query("APPLE", description="Company name")):
    base_path = os.path.dirname(__file__)
    company = company.upper()

    # Normalize company name to lowercase filenames (you can customize this)
    filename_map = {
        "APPLE": "apple",
        "MICROSOFT": "microsoft",
        "GOOGLE": "google",
        "TESLA": "tesla",
        "NVIDIA": "nvidia",
    }

    if company not in filename_map:
        return {"error": "Invalid company name."}

    actual_path = os.path.join(base_path, "data", f"{filename_map[company]}_actual.csv")
    predicted_path = os.path.join(base_path, "data", f"{filename_map[company]}_predicted.csv")

    actual_df = pd.read_csv(actual_path, usecols=["Date", "Close"]).rename(columns={"Close": "Actual"})
    predicted_df = pd.read_csv(predicted_path, usecols=["Date", "Close"]).rename(columns={"Close": "Predicted"})

    actual_df["Date"] = pd.to_datetime(actual_df["Date"])
    predicted_df["Date"] = pd.to_datetime(predicted_df["Date"])

    combined = pd.merge(actual_df, predicted_df, on="Date", how="outer").sort_values("Date")
    combined["Date"] = combined["Date"].dt.strftime("%Y-%m-%d")

    # Replace NaNs to make JSON safe
    combined.replace([np.nan, pd.NA, pd.NaT], None, inplace=True)

    return combined.to_dict(orient="records")


