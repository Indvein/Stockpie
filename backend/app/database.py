from pymongo import MongoClient
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Load variables from .env
load_dotenv()

# Fetch from .env if available, otherwise use hardcoded
username = os.getenv("DB_USER", "indvein")
password = quote_plus(os.getenv("DB_PASS", "harsh@2232004"))

MONGO_URI = f"mongodb+srv://{username}:{password}@stockpie.aarh7z8.mongodb.net/?retryWrites=true&w=majority&appName=Stockpie"

client = MongoClient(MONGO_URI)
db = client["stockpie"]
users_collection = db["users"]
