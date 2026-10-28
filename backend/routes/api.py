from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, current_app, jsonify, request
from pymongo.errors import PyMongoError
from services.sentiment import analyze_sentiment
from services.image_service import analyze_image

def create_api_blueprint():
    bp = Blueprint("api", __name__)

    def db():
        return current_app.extensions["mongo_db"]

    def mongo_available():
        try:
            current_app.extensions["mongo_client"].admin.command("ping")
            return True
        except PyMongoError:
            return False

    def serialize(doc):
        doc["_id"] = str(doc["_id"])
        return doc

    @bp.get("/health")
    def health():
        connected = mongo_available()
        return jsonify({
            "status": "ok" if connected else "degraded",
            "service": "Flask API",
            "database": "connected" if connected else "unavailable"
        }), (200 if connected else 503)

    @bp.post("/sentiment")
    def sentiment():
        data = request.get_json(silent=True) or {}
        text = data.get("text", "")
        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "Please provide non-empty text."}), 400
        if len(text) > 10000:
            return jsonify({"error": "Text must be 10,000 characters or fewer."}), 400

        result = analyze_sentiment(text.strip())
        record = {
            "type": "sentiment",
            "text": text.strip(),
            "label": result["label"],
            "score": result["score"],
            "scores": result["scores"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        try:
            inserted = db()["predictions"].insert_one(record)
            record["_id"] = str(inserted.inserted_id)
        except PyMongoError:
            return jsonify({"error": "Database unavailable. Check MongoDB and try again."}), 503
        return jsonify(record), 201

    @bp.get("/predictions")
    def predictions():
        try:
            docs = list(db()["predictions"].find().sort("_id", -1).limit(100))
            return jsonify([serialize(d) for d in docs])
        except PyMongoError:
            return jsonify({"error": "Database unavailable."}), 503

    @bp.delete("/predictions/<record_id>")
    def delete_prediction(record_id):
        try:
            oid = ObjectId(record_id)
        except (InvalidId, TypeError):
            return jsonify({"error": "Invalid prediction ID."}), 400
        try:
            result = db()["predictions"].delete_one({"_id": oid})
        except PyMongoError:
            return jsonify({"error": "Database unavailable."}), 503
        if result.deleted_count == 0:
            return jsonify({"error": "Prediction not found."}), 404
        return jsonify({"message": "Prediction deleted."})

    @bp.get("/stats")
    def stats():
        try:
            collection = db()["predictions"]
            total = collection.count_documents({})
            sentiment_count = collection.count_documents({"type": "sentiment"})
            image_count = collection.count_documents({"type": "image"})
            pipeline = [
                {"$match": {"type": "sentiment"}},
                {"$group": {"_id": "$label", "count": {"$sum": 1}}}
            ]
            grouped = list(collection.aggregate(pipeline))
            labels = ["positive", "neutral", "negative"]
            count_map = {item["_id"]: item["count"] for item in grouped}
            return jsonify({
                "total": total,
                "sentiment_count": sentiment_count,
                "image_count": image_count,
                "labels": labels,
                "counts": [count_map.get(label, 0) for label in labels]
            })
        except PyMongoError:
            return jsonify({"error": "Database unavailable."}), 503

    @bp.post("/classify")
    def classify():
        file = request.files.get("image")
        if file is None or not file.filename:
            return jsonify({"error": "Choose an image file first."}), 400
        try:
            result = analyze_image(file.stream)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400
        record = {
            "type": "image",
            "filename": file.filename[:200],
            "width": result["width"],
            "height": result["height"],
            "format": result["format"],
            "label": result["label"],
            "model_used": result["model_used"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        try:
            inserted = db()["predictions"].insert_one(record)
            record["_id"] = str(inserted.inserted_id)
        except PyMongoError:
            return jsonify({"error": "Image analyzed but database unavailable; result was not saved."}), 503
        return jsonify(record), 201

    return bp
