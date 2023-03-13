from flask import Flask, render_template, redirect, url_for, request
from helpers import load_config, get_db, get_review_count_for_product, extract_product_info
import time


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
        review_data = {}
        review_count = get_review_count_for_product(product_id)
        delay = review_count // 10 + 1
    else:
        review_data = product_data["review_data"]
        delay = None
    return render_template("index.html", endpoint="product_details", data={
        "product_id": product_id,
        "cooldown": app.config["REQUEST_COOLDOWN"],
        "delay": delay,
        "review_data": review_data
    })


@app.post("/product/<int:product_id>")
def details_post(product_id: int):
    # product_info = extract_product_info(product_id)
    # return product_info.to_json()
    time.sleep(5)
    return "Success!"


@app.get("/about")
def about():
    return render_template("index.html", endpoint="about", data={})
