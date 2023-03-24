from __future__ import annotations
from dotenv import dotenv_values
from montydb import MontyClient, MontyDatabase
from pymongo import MongoClient
from pymongo.database import Database
from flask import Flask, current_app
import pandas as pd
import requests
import bs4
import itertools
from time import sleep
from bs4 import BeautifulSoup, Tag
from dataclasses import dataclass
from typing import Iterator, Callable
from datetime import datetime


class ConfigurationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)


def load_config(app: Flask):
    config = dotenv_values(".env")

    if "REQUEST_COOLDOWN" not in config:
        config["REQUEST_COOLDOWN"] = 1
    else:
        try:
            config["REQUEST_COOLDOWN"] = float(config["REQUEST_COOLDOWN"])
        except ValueError:
            raise ConfigurationError("REQUEST_COOLDOWN must be a float!")
        if config["REQUEST_COOLDOWN"] < 1:
            print("Warning: REQUEST_COOLDOWN is lower than 1s, this could lead to Ceneo detecting the app as a DDOS attack and deploying a captcha!")

    if "SECRET_KEY" not in config:
        config["SECRET_KEY"] = "debug"
        print("Warning: SECRET_KEY not specified; Setting it to \"debug\". Change this before deploying in production!")

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


@dataclass
class QueryResults:
    results: list[Tag | None]

    def __iter__(self) -> Iterator[BeautifulSoup]:
        return self.results.__iter__()

    def extract(self, func: Callable[[Tag], str | list[str]]) -> list[str | list[str] | None]:
        return [func(x) if x is not None else None for x in self.results]


@dataclass
class Reviews:
    reviews_list: list[BeautifulSoup]

    def __iter__(self) -> Iterator[BeautifulSoup]:
        return self.reviews_list.__iter__()

    def query(self, *args, **kwargs) -> QueryResults:
        return QueryResults(list(map(lambda x: x.find(*args, **kwargs), self)))


@dataclass
class Product:
    review_data: pd.DataFrame
    filter_ranges: dict[str, dict[str, float | str | int]]
    photo_url: str
    product_name: str
    review_count: int
    pros_count: int
    cons_count: int
    avg_rating: int

    def sort(self, field: str, ascending: bool):
        self.review_data.sort_values(field, ascending=ascending, inplace=True)

    def filter(self, filters: dict[str, dict[str, float | str | int]]):
        df = self.review_data
        df = df[df["recommended"].isin([k == "true" for k, v in filters["recommended"].items() if v])]
        df = df[df["trusted"].isin([k == "true" for k, v in filters["trusted"].items() if v])]
        df = df[df["stars"].between(filters["stars"]["min"], filters["stars"]["max"])]
        df = df[df["time_posted"].between(filters["time_posted"]["min"], filters["time_posted"]["max"])]
        df = df[df["time_bought"].between(filters["time_bought"]["min"], filters["time_bought"]["max"]) | df["time_bought"].isna()]
        df = df[df["upvotes"].between(filters["upvotes"]["min"], filters["upvotes"]["max"])]
        df = df[df["downvotes"].between(filters["downvotes"]["min"], filters["downvotes"]["max"])]
        self.review_data = df

    def as_dict(self) -> dict:
        return {
            "review_data": self.review_data.to_dict(),
            "filter_ranges": self.filter_ranges,
            "photo_url": self.photo_url,
            "product_name": self.product_name,
            "review_count": self.review_count,
            "pros_count": self.pros_count,
            "cons_count": self.cons_count,
            "avg_rating": self.avg_rating
        }


def get_basic_info_for_product(product_id: int) -> tuple(int, str, str):
    response = requests.get(f"https://www.ceneo.pl/{product_id}#tab=reviews")

    main_page = BeautifulSoup(response.text, features="html.parser")
    review_count = int(main_page.find(class_="product-review__link").find("span").string)
    photo_url = main_page.find(class_="gallery-carousel__media")["src"]
    product_name = main_page.find(class_="card-outer-title").find("strong").string

    return review_count, photo_url, product_name


def get_n_reviews_for_product(review_count: int, product_id: int) -> Reviews:
    review_soups: list[BeautifulSoup] = []
    for i in range(1, review_count // 10 + 2):
        sleep(current_app.config["REQUEST_COOLDOWN"])
        r_soup = bs4.BeautifulSoup(
            requests.get(f"https://www.ceneo.pl/{product_id}/opinie-{i}", headers={"Cookie": "__utmf=24ae1c54a8f164745b922da4d63675a9_OvbWFZohA88uOLLhXYFzpA=="}).text,
            features="html.parser"
        )
        review_soups.append(r_soup)

    reviews_from_each_soup = [soup.find_all(class_="js_product-review") for soup in review_soups]

    return Reviews(list(itertools.chain.from_iterable(reviews_from_each_soup)))


def extract_product_info(product_id: int) -> Product:

    review_count, photo_url, product_name = get_basic_info_for_product(product_id)
    reviews = get_n_reviews_for_product(review_count, product_id)

    review_id = [x["data-entry-id"] for x in reviews]
    username = reviews.query(class_="user-post__author-name").extract(lambda x: x.string)
    recommended = [bool(x) for x in reviews.query(class_="recommended")]
    stars = reviews.query(class_="user-post__score-count").extract(lambda x: float(x.string.split("/")[0].replace(",", ".")))
    trusted = [bool(x) for x in reviews.query(class_="review-pz")]
    time_posted = reviews.query("time").extract(lambda x: datetime.fromisoformat(x["datetime"]).isoformat())
    time_bought = reviews.query("time").extract(lambda x: datetime.fromisoformat(x.find_next_sibling()["datetime"]).isoformat() if x.find_next_sibling() else None)
    votes_yes = reviews.query(class_="vote-yes").extract(lambda x: int(x["data-total-vote"]))
    votes_no = reviews.query(class_="vote-no").extract(lambda x: int(x["data-total-vote"]))
    content = reviews.query(class_="user-post__text").extract(lambda x: x.string)
    positives = reviews.query(class_="review-feature__title--positives").extract(lambda x: [x.string for x in x.find_next_siblings()])
    negatives = reviews.query(class_="review-feature__title--negatives").extract(lambda x: [x.string for x in x.find_next_siblings()])

    df = pd.DataFrame(
        {
            "id": review_id,
            "username": username,
            "recommended": recommended,
            "stars": stars,
            "trusted": trusted,
            "time_posted": time_posted,
            "time_bought": time_bought,
            "upvotes": votes_yes,
            "downvotes": votes_no,
            "content": content,
            "positives": positives,
            "negatives": negatives
        }
    )

    filter_ranges = {
        "stars": {
            "min": float(df["stars"].dropna().min()),
            "max": float(df["stars"].dropna().max())
        },
        "time_posted": {
            "min": df["time_posted"].dropna().min(),
            "max": df["time_posted"].dropna().max()
        },
        "time_bought": {
            "min": df["time_bought"].dropna().min(),
            "max": df["time_bought"].dropna().max()
        },
        "upvotes": {
            "min": int(df["upvotes"].dropna().min()),
            "max": int(df["upvotes"].dropna().max())
        },
        "downvotes": {
            "min": int(df["downvotes"].dropna().min()),
            "max": int(df["downvotes"].dropna().max())
        }
    }

    pros_count = df["upvotes"].explode().value_counts().size
    cons_count = df["downvotes"].explode().value_counts().size
    avg_rating = df["stars"].mean()

    return Product(
        review_data=df,
        filter_ranges=filter_ranges,
        photo_url=photo_url,
        product_name=product_name,
        review_count=review_count,
        pros_count=pros_count,
        cons_count=cons_count,
        avg_rating=avg_rating
    )
