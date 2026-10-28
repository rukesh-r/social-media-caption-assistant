import os
from flask import Flask, jsonify, request
from flask import request, jsonify
from flask_cors import CORS
from rag.routes import rag_bp
from rag.retrieval_routes import retrieval_bp
from rag.storage_routes import storage_bp
from rag.generation_routes import generation_bp
from services.ai_service import (
    generate_caption,
    generate_image_caption,
    rewrite_caption,
    analyze_caption
)

from services.database import (
    save_history,
    get_history,
    delete_history
)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)
app.register_blueprint(rag_bp)
app.register_blueprint(storage_bp)
app.register_blueprint(retrieval_bp)
app.register_blueprint(generation_bp)
CORS(app)


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "message":
            "CaptionCraft AI Backend is running!"

    })


# ============================================================
# TEXT CAPTION GENERATION
# ============================================================

@app.route(
    "/generate-caption",
    methods=["POST"]
)
def generate_text_caption():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "error":
                    "No JSON data received"

            }), 400


        topic = data.get(
            "topic",
            ""
        ).strip()


        platform = data.get(
            "platform",
            "Instagram"
        )


        tone = data.get(
            "tone",
            "Casual"
        )


        audience = data.get(
            "audience",
            "General"
        )


        keywords = data.get(
            "keywords",
            ""
        )


        length = data.get(
            "length",
            "Medium"
        )


        if not topic:

            return jsonify({

                "success": False,

                "error":
                    "Topic is required"

            }), 400


        result = generate_caption(

            topic=topic,

            platform=platform,

            tone=tone,

            audience=audience,

            keywords=keywords,

            length=length

        )


        # ====================================================
        # SAVE TO DATABASE
        # ====================================================

        try:

            save_history(

                history_type="generated",

                platform=platform,

                input_text=topic,

                result=result

            )

        except Exception as db_error:

            print(
                "DATABASE SAVE ERROR:",
                str(db_error)
            )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "TEXT GENERATION ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# IMAGE CAPTION GENERATION
# ============================================================

@app.route(
    "/generate-image-caption",
    methods=["POST"]
)
def generate_image():

    try:

        if "image" not in request.files:

            return jsonify({

                "success": False,

                "error":
                    "No image uploaded"

            }), 400


        image = request.files["image"]


        if image.filename == "":

            return jsonify({

                "success": False,

                "error":
                    "Please select an image"

            }), 400


        allowed_types = {

            "image/jpeg",

            "image/png",

            "image/jpg",

            "image/webp"

        }


        if image.content_type not in allowed_types:

            return jsonify({

                "success": False,

                "error":
                    "Unsupported image format. "
                    "Use JPG, JPEG, PNG or WEBP."

            }), 400


        platform = request.form.get(
            "platform",
            "Instagram"
        )


        tone = request.form.get(
            "tone",
            "Casual"
        )


        audience = request.form.get(
            "audience",
            "General"
        )


        length = request.form.get(
            "length",
            "Medium"
        )


        result = generate_image_caption(

            image=image,

            platform=platform,

            tone=tone,

            audience=audience,

            length=length

        )


        # ====================================================
        # SAVE IMAGE CAPTION RESULT
        # ====================================================

        try:

            save_history(

                history_type="generated",

                platform=platform,

                input_text="Image Caption",

                result=result

            )

        except Exception as db_error:

            print(
                "DATABASE SAVE ERROR:",
                str(db_error)
            )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "IMAGE GENERATION ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# CAPTION REWRITER
# ============================================================

@app.route(
    "/rewrite-caption",
    methods=["POST"]
)
def rewrite():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "error":
                    "No JSON data received"

            }), 400


        original_caption = data.get(
            "caption",
            ""
        ).strip()


        rewrite_style = data.get(
            "style",
            "Make More Engaging"
        )


        platform = data.get(
            "platform",
            "Instagram"
        )


        if not original_caption:

            return jsonify({

                "success": False,

                "error":
                    "Caption is required"

            }), 400


        result = rewrite_caption(

            original_caption=
                original_caption,

            rewrite_style=
                rewrite_style,

            platform=
                platform

        )


        # ====================================================
        # SAVE REWRITE RESULT
        # ====================================================

        try:

            save_history(

                history_type="rewritten",

                platform=platform,

                input_text=
                    original_caption,

                result=result

            )

        except Exception as db_error:

            print(
                "DATABASE SAVE ERROR:",
                str(db_error)
            )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "REWRITE ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# CAPTION QUALITY ANALYZER
# ============================================================

@app.route(
    "/analyze-caption",
    methods=["POST"]
)
def analyze():

    try:

        data = request.get_json()


        if not data:

            return jsonify({

                "success": False,

                "error":
                    "No JSON data received"

            }), 400


        caption = data.get(
            "caption",
            ""
        ).strip()


        platform = data.get(
            "platform",
            "Instagram"
        )


        if not caption:

            return jsonify({

                "success": False,

                "error":
                    "Caption is required"

            }), 400


        result = analyze_caption(

            caption=caption,

            platform=platform

        )


        # ====================================================
        # SAVE ANALYSIS
        # ====================================================

        try:

            save_history(

                history_type="analyzed",

                platform=platform,

                input_text=caption,

                result=result

            )

        except Exception as db_error:

            print(
                "DATABASE SAVE ERROR:",
                str(db_error)
            )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "ANALYZER ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# GET CAPTION HISTORY
# ============================================================


@app.route("/history", methods=["GET"])
def history():
    try:
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "error": "Authentication token is missing."
            }), 401

        access_token = auth_header.split(" ", 1)[1].strip()

        if not access_token:
            return jsonify({
                "success": False,
                "error": "Authentication token is empty."
            }), 401

        history_data = get_history(access_token)

        return jsonify({
            "success": True,
            "history": history_data
        }), 200

    except Exception as e:
        print("HISTORY ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": "Unable to load caption history."
        }), 500



# ============================================================
# DELETE HISTORY
# ============================================================

@app.route(
    "/history/<int:history_id>",
    methods=["DELETE"]
)
def remove_history(
    history_id
):

    try:

        delete_history(
            history_id
        )


        return jsonify({

            "success": True,

            "message":
                "History deleted successfully"

        })


    except Exception as e:

        print(
            "DELETE HISTORY ERROR:",
            str(e)
        )


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False,
        use_reloader=False
    )