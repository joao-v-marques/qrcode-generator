import io

import qrcode
from PIL import Image


def generate_qrcode_bytes(
    link: str,
    fill_color: str = "#000000",
    back_color: str = "#ffffff",
    border: int = 4,
    size_px: int = 400,
) -> bytes:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=border,
    )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fill_color, back_color=back_color).convert("RGB")
    img = img.resize((size_px, size_px), Image.NEAREST)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()
