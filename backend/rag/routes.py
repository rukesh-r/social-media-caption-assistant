
from flask import Blueprint, jsonify, request

from rag.document_processor import process_document


rag_bp = Blueprint("rag", __name__)


@rag_bp.route("/rag/process-document", methods=["POST"])
def process_document_route():
    uploaded_file = request.files.get("file")

    if uploaded_file is None:
        return jsonify({
            "success": False,
            "error": "Please upload a file using the 'file' field."
        }), 400

    try:
        file_bytes = uploaded_file.read()

        result = process_document(
            file_bytes=file_bytes,
            filename=uploaded_file.filename,
        )

        return jsonify({
            "success": True,
            "filename": result["filename"],
            "character_count": result["character_count"],
            "chunk_count": result["chunk_count"],
            "chunks": result["chunks"],
        }), 200

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except Exception:
        return jsonify({
            "success": False,
            "error": "An unexpected error occurred while processing the document."
        }), 500
