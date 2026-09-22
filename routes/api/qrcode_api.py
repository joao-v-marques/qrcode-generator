from flask import Blueprint, jsonify, request

from service.qrcode_service import generate_qrcode_data_uri, InvalidLinkError

bp_api_qrcode = Blueprint("bp_api_qrcode", __name__, url_prefix="/api")


@bp_api_qrcode.route("/qrcode", methods=["POST"])
def create_qrcode():
    data = request.get_json(silent=True) or {}
    link = data.get("link")

    try:
        image = generate_qrcode_data_uri(link)
    except InvalidLinkError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify({"image": image})
