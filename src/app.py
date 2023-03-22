from flask import Flask, render_template, redirect, url_for, request
from helpers import load_config, get_db, get_review_count_for_product, extract_product_info
import json
from datetime import datetime
import math
from pandas import DataFrame


app = Flask(__name__, template_folder="./static/templates")

load_config(app)

db = get_db(app)


@app.get("/")
def index():
    return render_template("index.html", endpoint="index", data={})


@app.get("/product")
def product():
    return redirect(url_for("list"))


@app.get("/product/list")
def list():
    return render_template("index.html", endpoint="list", data={})


@app.get("/product/extract")
def extract():
    return render_template("index.html", endpoint="extract", data={})


@app.get("/product/<int:product_id>")
def details_get(product_id: int):
    product_data = db.products.find_one({"product_id": product_id})
    if not product_data:
        queue_data = db.queue.find_one({"product_id": product_id})
        review_data = {}
        review_count = get_review_count_for_product(product_id)
        delay = review_count // 10 + 2
        if not queue_data:
            elapsed = 0
        else:
            delta = datetime.utcnow() - queue_data["start_time"]
            elapsed = delta.seconds + math.ceil(delta.microseconds / 1000000)
        filter_data = None
    else:
        review_data = product_data["review_data"]
        df = DataFrame.from_dict(review_data)
        sort, ascending = request.args.get("sort", None), int(request.args.get("asc", 0))
        if sort:
            df.sort_values(sort, ascending=bool(ascending), inplace=True)
        filter_data = {
            "Stars": {
                "min": float(df["Stars"].dropna().min()),
                "max": float(df["Stars"].dropna().max())
            },
            "Time Posted": {
                "min": df["Time Posted"].dropna().min(),
                "max": df["Time Posted"].dropna().max()
            },
            "Time Bought": {
                "min": df["Time Bought"].dropna().min(),
                "max": df["Time Bought"].dropna().max()
            },
            "Upvotes": {
                "min": int(df["Upvotes"].dropna().min()),
                "max": int(df["Upvotes"].dropna().max())
            },
            "Downvotes": {
                "min": int(df["Downvotes"].dropna().min()),
                "max": int(df["Downvotes"].dropna().max())
            }
        }
        delay = None
        elapsed = None
    return render_template("index.html", endpoint="product_details", data={
        "product_id": product_id,
        "cooldown": app.config["REQUEST_COOLDOWN"],
        "elapsed": elapsed,
        "delay": delay,
        "review_data": df.to_dict(orient="list"),
        "filter_data": filter_data
    })


@app.post("/product/<int:product_id>")
def details_post(product_id: int):
    if db.products.find_one({"product_id": product_id}):
        return json.dumps({"state": "exists"})
    elif db.queue.find_one({"product_id": product_id}):
        return json.dumps({"state": "in_progress"})
    else:
        db.queue.insert_one({"product_id": product_id, "start_time": datetime.utcnow()})
        product_info = extract_product_info(product_id)
        db.queue.delete_one({"product_id": product_id})
        db.products.insert_one({"product_id": product_id, "review_data": product_info.to_dict()})
        return json.dumps({"state": "completed"})


@app.get("/about")
def about():
    return render_template("index.html", endpoint="about", data={})
