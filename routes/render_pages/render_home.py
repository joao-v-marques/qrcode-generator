from flask import Blueprint, render_template

bp_render_home = Blueprint("bp_render_home", __name__)

@bp_render_home.route("/", methods=['GET'])
def render_home():
    return render_template("home.html")