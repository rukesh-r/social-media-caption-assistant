
from flask import Blueprint, jsonify, request

from rag.generation_service import generate_rag_caption
from services.database import save_history

generation_bp = Blueprint("rag_generation", __name__)


@generation_bp.route("/rag/generate-caption", methods=["POST"])
def generate_rag_caption_route():
    auth_header = request.headers.get("Authorization", "")

    access_token = (
        auth_header[7:].strip()
        if auth_header.startswith("Bearer ")
        else None
    )

    if not access_token:
        return jsonify({
            "success": False,
            "error": "Please log in before generating captions.",
        }), 401

    body = request.get_json(silent=True) or {}

    topic = body.get("topic", "")
    platform = body.get("platform", "Instagram")
    tone = body.get("tone", "Friendly")
    audience = body.get("audience", "General audience")
    keywords = body.get("keywords", "")
    length = body.get("length", "Medium")

    if not isinstance(topic, str) or not topic.strip():
        return jsonify({
            "success": False,
            "error": "Topic is required.",
        }), 400

    try:
        result = generate_rag_caption(
            topic=topic,
            platform=platform,
            tone=tone,
            audience=audience,
            keywords=keywords,
            length=length,
            access_token=access_token,
        )

        save_history(
            access_token=access_token,
            history_type="RAG Caption",
            platform=platform,
            input_text=topic,
            result=result,
        )

        return jsonify({
            "success": True,
            "result": result,
        }), 200

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except Exception as error:
        print("RAG caption generation error:", str(error))

        return jsonify({
            "success": False,
            "error": (
                "RAG caption generation failed. "
                "Check the backend terminal."
            ),
        }), 500
