import os
from flask import Flask
from configs import config_all
from dotenv import load_dotenv
from flask_cors import CORS
from waitress import serve

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    CORS(app)
    config_all(app)

    return app

if __name__ == '__main__':
    app = create_app()

    enviroment = os.getenv("FLASK_ENV", "development")

    if enviroment == "development":
        app.run(debug=True)
    else:
        print("Servidor Waitress inicializado com sucesso...")
        serve(app, host='0.0.0.0', port=5007)