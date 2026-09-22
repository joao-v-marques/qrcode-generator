from flask import Blueprint, jsonify, request

from service.qrcode_service import generate_qrcode_data_uri, QrCodeServiceError

bp_api_qrcode = Blueprint("bp_api_qrcode", __name__, url_prefix="/api")


@bp_api_qrcode.route("/qrcode", methods=["POST"])
def create_qrcode():
    data = request.get_json(silent=True) or {}

    try:
        image = generate_qrcode_data_uri(
            link=data.get("link"),
            fill_color=data.get("fill_color"),
            back_color=data.get("back_color"),
            size=data.get("size"),
            border=data.get("border"),
        )
    except QrCodeServiceError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify({"image": image})
