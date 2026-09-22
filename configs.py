from routes.render_pages.render_home import bp_render_home
from routes.api.qrcode_api import bp_api_qrcode

def config_all(app):
    config_bps(app)

def config_bps(app):
    app.register_blueprint(bp_render_home)
    app.register_blueprint(bp_api_qrcode)