from flask import Flask, render_template, redirect, url_for, request
from helpers import load_config, get_db, extract_product_info


app = Flask(__name__, template_folder="./static/templates")

load_config(app)

db = get_db(app)


@app.get("/")
def index():
    return render_template("index.html")
