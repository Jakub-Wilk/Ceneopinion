from __future__ import annotations
from dotenv import dotenv_values
from montydb import MontyClient, MontyDatabase
from pymongo import MongoClient
from pymongo.database import Database
from flask import Flask
import pandas as pd
import requests
import bs4
import itertools
from time import sleep
from bs4 import BeautifulSoup, Tag
from dataclasses import dataclass
from typing import Iterator, Callable


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


def get_reviews_for_product(id: int) -> Reviews:
    response = requests.get(f"https://www.ceneo.pl/{id}")

    main_page = BeautifulSoup(response.text, features="html.parser")
    review_count = int(main_page.find(class_="product-review__link").find("span").string)

    review_soups: list[BeautifulSoup] = []
    for i in range(1, review_count // 10 + 2):
        sleep(1)
        r_soup = bs4.BeautifulSoup(
            requests.get(f"https://www.ceneo.pl/{id}/opinie-{i}").text,
            features="html.parser"
        )
        review_soups.append(r_soup)

    reviews_from_each_soup = [soup.find_all(class_="js_product-review") for soup in review_soups]

    return Reviews(list(itertools.chain.from_iterable(reviews_from_each_soup)))


def extract_product_info(id: int) -> pd.DataFrame:

    reviews = get_reviews_for_product(id)

    review_id = [x["data-entry-id"] for x in reviews]
    username = reviews.query(class_="user-post__author-name").extract(lambda x: x.string)
    recommended = [bool(x) for x in reviews.query(class_="recommended")]
    stars = reviews.query(class_="user-post__score-count").extract(lambda x: x.string)
    trusted = [bool(x) for x in reviews.query(class_="review-pz")]
    time_posted = reviews.query("time").extract(lambda x: x["datetime"])
    time_bought = reviews.query("time").extract(lambda x: x.find_next_sibling()["datetime"] if x.find_next_sibling() else None)
    votes_yes = reviews.query(class_="vote-yes").extract(lambda x: x["data-total-vote"])
    votes_no = reviews.query(class_="vote-no").extract(lambda x: x["data-total-vote"])
    content = reviews.query(class_="user-post__text").extract(lambda x: x.string)
    positives = reviews.query(class_="review-feature__title--positives").extract(lambda x: [x.string for x in x.find_next_siblings()])
    negatives = reviews.query(class_="review-feature__title--negatives").extract(lambda x: [x.string for x in x.find_next_siblings()])

    df = pd.DataFrame(
        {
            "ID": review_id,
            "Username": username,
            "Recommended": recommended,
            "Stars": stars,
            "Trusted": trusted,
            "Time Posted": time_posted,
            "Time Bought": time_bought,
            "Upvotes": votes_yes,
            "Downvotes": votes_no,
            "Content": content,
            "Positives": positives,
            "Negatives": negatives
        }
    )
    return df
