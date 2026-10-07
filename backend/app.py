from flask import Flask, jsonify, request
from flask_cors import CORS

from services.ai_service import generate_caption

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "CaptionCraft AI Backend is running!"
    })


@app.route("/generate-caption", methods=["POST"])
def generate():

    data = request.get_json()

    topic = data.get("topic")
    platform = data.get("platform")
    tone = data.get("tone")
    audience = data.get("audience")
    keywords = data.get("keywords")
    length = data.get("length")

    if not topic:
        return jsonify({
            "error": "Topic is required"
        }), 400

    try:

        result = generate_caption(
            topic,
            platform,
            tone,
            audience,
            keywords,
            length
        )

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)