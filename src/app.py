from flask import Flask, render_template
from .helpers import load_config, get_db


app = Flask(__name__, template_folder="./static/templates")

load_config(app)

db = get_db(app)


@app.get("/")
def index():
    return render_template("index.html")
