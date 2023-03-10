from dotenv import dotenv_values
from montydb import MontyClient, MontyDatabase
from pymongo import MongoClient
from pymongo.database import Database
from flask import Flask


class ConfigurationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


def load_config(app: Flask):
    config = dotenv_values(".env")

    if "SECRET_KEY" not in config:
        config["SECRET_KEY"] = "debug"
        print("WARNING: SECRET_KEY not specified; Setting it to \"debug\". Change this before deploying in production!")

    if "MONGO_MODE" not in config:
        config["MONGO_MODE"] = "monty"

    if config["MONGO_MODE"] not in ("monty", "mongo"):
        raise ConfigurationError(
            f"Unknown Mongo mode! Possible options: \"monty\", \"mongo\"; Got: \"{config['MONGO_MODE']}\""
        )

    if config["MONGO_MODE"] == "mongo" and "MONGO_URI" not in config:
        raise ConfigurationError(
            "You must provide the Mongo URI (MONGO_URI) if using MongoDB!"
        )

    for key in config:
        app.config[key] = config[key]


def get_db(app: Flask) -> MontyDatabase | Database:
    match app.config["MONGO_MODE"]:
        case "monty":
            return MontyClient().db
        case "mongo":
            return MongoClient(app.config["MONGO_URI"]).db
