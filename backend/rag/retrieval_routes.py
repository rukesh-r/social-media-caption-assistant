
from flask import Blueprint, jsonify, request

from rag.retrieval_service import retrieve_relevant_chunks

retrieval_bp = Blueprint("rag_retrieval", __name__)


@retrieval_bp.route("/rag/search", methods=["POST"])
def search_knowledge():
    auth_header = request.headers.get("Authorization", "")

    access_token = (
        auth_header[7:].strip()
        if auth_header.startswith("Bearer ")
        else None
    )

    if not access_token:
        return jsonify({
            "success": False,
            "error": "Please log in before searching."
        }), 401

    body = request.get_json(silent=True) or {}
    query = body.get("query", "")

    try:
        results = retrieve_relevant_chunks(
            query=query,
            access_token=access_token,
        )

        return jsonify({
            "success": True,
            "result_count": len(results),
            "results": results,
        }), 200

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except Exception as error:
        print("RAG retrieval error:", str(error))

        return jsonify({
            "success": False,
            "error": "Semantic search failed. Check the backend terminal."
        }), 500
