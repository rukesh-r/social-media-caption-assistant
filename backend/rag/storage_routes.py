
from flask import Blueprint, jsonify, request

from rag.knowledge_service import store_document, list_documents, delete_document

storage_bp = Blueprint("rag_storage", __name__)


@storage_bp.route("/rag/upload-document", methods=["POST"])
def upload_document():
    auth_header = request.headers.get("Authorization", "")
    access_token = (
        auth_header[7:].strip()
        if auth_header.startswith("Bearer ")
        else None
    )

    if not access_token:
        return jsonify({
            "success": False,
            "error": "Please log in before uploading documents."
        }), 401

    uploaded_file = request.files.get("file")

    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({
            "success": False,
            "error": "Please select a document."
        }), 400

    try:
        result = store_document(
            file_bytes=uploaded_file.read(),
            filename=uploaded_file.filename,
            access_token=access_token,
        )

        return jsonify({
            "success": True,
            "message": "Document processed and stored successfully.",
            **result,
        }), 200

    except ValueError as error:
        return jsonify({
            "success": False,
            "error": str(error),
        }), 400

    except Exception as error:
        print("RAG upload error:", str(error))

        return jsonify({
            "success": False,
            "error": "Document processing or storage failed. Check the backend terminal."
        }), 500


@storage_bp.route("/rag/documents", methods=["GET"])
def get_documents():
    auth_header = request.headers.get("Authorization", "")
    access_token = auth_header[7:].strip() if auth_header.startswith("Bearer ") else None

    if not access_token:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    try:
        docs = list_documents(access_token)
        return jsonify({"success": True, "documents": docs}), 200
    except Exception as error:
        print("RAG list error:", str(error))
        return jsonify({"success": False, "error": "Unable to list documents."}), 500


@storage_bp.route("/rag/documents/<path:document_name>", methods=["DELETE"])
def remove_document(document_name):
    auth_header = request.headers.get("Authorization", "")
    access_token = auth_header[7:].strip() if auth_header.startswith("Bearer ") else None

    if not access_token:
        return jsonify({"success": False, "error": "Authentication required."}), 401

    try:
        result = delete_document(access_token, document_name)
        return jsonify({"success": True, **result}), 200
    except Exception as error:
        print("RAG delete error:", str(error))
        return jsonify({"success": False, "error": "Unable to delete document."}), 500
