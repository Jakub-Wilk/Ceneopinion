from flask import Flask, render_template, redirect, url_for, request
from helpers import load_config, get_db, extract_product_info
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
    return render_template("index.html", endpoint="product_details", data={"product_id": product_id})


@app.post("/product/<int:product_id>")
def details_post(product_id: int):
    # product_info = extract_product_info(product_id)
    # return product_info.to_json()
    time.sleep(5)
    return "Success!"


@app.get("/about")
def about():
    return render_template("index.html", endpoint="about", data={})
