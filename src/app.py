from flask import Flask, render_template, redirect, url_for, request
from helpers import load_config, get_db, get_basic_info_for_product, extract_product_info, Product
import json
from datetime import datetime
import math
import pandas as pd
import base64
import urllib


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
    product_data = db.products.find_one({"product_id": product_id})["review_data"]
    if not product_data:
        queue_data = db.queue.find_one({"product_id": product_id})
        review_data = {}
        review_count, _, _ = get_basic_info_for_product(product_id)
        delay = review_count // 10 + 2
        if not queue_data:
            elapsed = 0
        else:
            delta = datetime.utcnow() - queue_data["start_time"]
            elapsed = delta.seconds + math.ceil(delta.microseconds / 1000000)
        filter_ranges = None
        product_overview = None
    else:
        product_data["review_data"] = pd.DataFrame(product_data["review_data"])
        product = Product(**product_data)
        filters = request.args.get("filters", None)
        if filters:
            filters = json.loads(urllib.parse.unquote(base64.urlsafe_b64decode(filters)))
            product.filter(filters)
        sort_by, ascending = request.args.get("sort", None), int(request.args.get("asc", 0))
        if sort_by:
            product.sort(sort_by, ascending)
        delay = None
        elapsed = None
        review_data = product.review_data.to_dict(orient="list")
        filter_ranges = product.filter_ranges
        product_overview = {
            "photo_url": product.photo_url,
            "product_name": product.product_name,
            "review_count": product.review_count,
            "pros_count": product.pros_count,
            "cons_count": product.cons_count,
            "avg_rating": product.avg_rating
        }
    return render_template("index.html", endpoint="product_details", data={
        "product_id": product_id,
        "cooldown": app.config["REQUEST_COOLDOWN"],
        "elapsed": elapsed,
        "delay": delay,
        "review_data": review_data,
        "filter_data": filter_ranges,
        "product_overview": product_overview
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
        db.products.insert_one({"product_id": product_id, "review_data": product_info.as_dict()})
        return json.dumps({"state": "completed"})


@app.get("/about")
def about():
    return render_template("index.html", endpoint="about", data={})
