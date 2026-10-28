import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from routes.api import create_api_blueprint

load_dotenv()

def create_app():
    app = Flask(__name__)
    max_mb = int(os.getenv("MAX_CONTENT_LENGTH_MB", "5"))
    app.config["MAX_CONTENT_LENGTH"] = max_mb * 1024 * 1024

    allowed_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    CORS(app, resources={r"/api/*": {"origins": [allowed_origin, "http://127.0.0.1:5173"]}})

    mongo_uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    db_name = os.getenv("DB_NAME", "fullstack_ai_app")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2500)
    app.extensions["mongo_client"] = client
    app.extensions["mongo_db"] = client[db_name]

    app.register_blueprint(create_api_blueprint(), url_prefix="/api")

    @app.get("/")
    def index():
        return jsonify({
            "name": "Full-Stack AI Web Application",
            "api": "/api/health",
            "status": "running"
        })

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify({"error": f"Upload is too large. Maximum size is {max_mb} MB."}), 413

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": getattr(error, "description", "Bad request")}), 400

    return app

app = create_app()

if __name__ == "__main__":
    # Flask's development server is for local development only.
    app.run(host="127.0.0.1", port=5000, debug=True)
