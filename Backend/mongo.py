from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # By default, looks for a .env file in the current directory


connection_string = os.getenv("database")

client = MongoClient(connection_string)

# Access the database and collection as usual
db = client["Authorization"]
collection = db["users"]

# SignUp
def Insert(name,password):
    user = collection.find_one({"name": name})
    if user:
        return False
    doc = {"name": name,"password":password}
    collection.insert_one(doc)
    return True


# Login
def Validate(name,password):
    user = collection.find_one({'name': name, 'password': password})
    if user:
        return True
    return False