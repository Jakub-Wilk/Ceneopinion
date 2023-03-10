from flask import Flask, render_template

app = Flask(__name__, template_folder="./static/templates")


@app.get("/")
def index():
    return render_template("index.html")
