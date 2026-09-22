import base64
import re

from utils.generate_qrcode import generate_qrcode_bytes

HEX_COLOR_PATTERN = re.compile(r"^#(?:[0-9a-fA-F]{3}){1,2}$")

SIZE_PRESETS = {
    "small": 200,
    "medium": 400,
    "large": 800,
    "extra_large": 1200,
}
DEFAULT_SIZE = "medium"
DEFAULT_FILL_COLOR = "#000000"
DEFAULT_BACK_COLOR = "#ffffff"
DEFAULT_BORDER = 4
MIN_BORDER = 0
MAX_BORDER = 20


class QrCodeServiceError(ValueError):
    """Erro de negócio relacionado à geração do QR Code."""


class InvalidLinkError(QrCodeServiceError):
    pass


class InvalidColorError(QrCodeServiceError):
    pass


class InvalidSizeError(QrCodeServiceError):
    pass


class InvalidBorderError(QrCodeServiceError):
    pass


def _validate_link(link):
    link = (link or "").strip()
    if not link:
        raise InvalidLinkError("Informe um link para gerar o QR Code.")
    return link


def _validate_color(value, field_label):
    value = value or ""
    if not HEX_COLOR_PATTERN.match(value):
        raise InvalidColorError(f"{field_label} inválida. Use um hex válido, ex: #00995d.")
    return value


def _validate_size(size):
    size = size or DEFAULT_SIZE
    if size not in SIZE_PRESETS:
        options = ", ".join(SIZE_PRESETS)
        raise InvalidSizeError(f"Tamanho inválido. Opções disponíveis: {options}.")
    return SIZE_PRESETS[size]


def _validate_border(border):
    if border is None:
        return DEFAULT_BORDER
    if not isinstance(border, int) or isinstance(border, bool):
        raise InvalidBorderError("Borda inválida. Informe um número inteiro.")
    if not (MIN_BORDER <= border <= MAX_BORDER):
        raise InvalidBorderError(f"Borda inválida. Use um valor entre {MIN_BORDER} e {MAX_BORDER}.")
    return border


def generate_qrcode_data_uri(link, fill_color=None, back_color=None, size=None, border=None):
    link = _validate_link(link)
    fill_color = _validate_color(fill_color or DEFAULT_FILL_COLOR, "Cor do QR Code")
    back_color = _validate_color(back_color or DEFAULT_BACK_COLOR, "Cor de fundo")
    if fill_color.lower() == back_color.lower():
        raise InvalidColorError("A cor do QR Code e a cor de fundo não podem ser iguais.")
    size_px = _validate_size(size)
    border = _validate_border(border)

    image_bytes = generate_qrcode_bytes(
        link,
        fill_color=fill_color,
        back_color=back_color,
        border=border,
        size_px=size_px,
    )
    encoded = base64.b64encode(image_bytes).decode("ascii")
    return f"data:image/png;base64,{encoded}"
