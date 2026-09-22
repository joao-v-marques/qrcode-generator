import base64

from utils.generate_qrcode import generate_qrcode_bytes


class InvalidLinkError(ValueError):
    pass


def generate_qrcode_data_uri(link: str) -> str:
    link = (link or "").strip()
    if not link:
        raise InvalidLinkError("Informe um link para gerar o QR Code.")

    image_bytes = generate_qrcode_bytes(link)
    encoded = base64.b64encode(image_bytes).decode("ascii")
    return f"data:image/png;base64,{encoded}"
