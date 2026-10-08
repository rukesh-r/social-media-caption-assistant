from flask import Flask, jsonify, request
from flask_cors import CORS

from services.ai_service import (
    generate_caption,
    generate_image_caption,
    rewrite_caption
)


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "CaptionCraft AI Backend is running!"
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
                "error": "No JSON data received"
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
                "error": "Topic is required"
            }), 400


        result = generate_caption(

            topic=topic,

            platform=platform,

            tone=tone,

            audience=audience,

            keywords=keywords,

            length=length

        )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "TEXT GENERATION ERROR:"
        )

        print(str(e))


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

                "error": "No image uploaded"

            }), 400


        image = request.files["image"]


        if image.filename == "":

            return jsonify({

                "success": False,

                "error": "Please select an image"

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

                "error": (
                    "Unsupported image format. "
                    "Use JPG, JPEG, PNG or WEBP."
                )

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


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "IMAGE GENERATION ERROR:"
        )

        print(str(e))


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

                "error": "No JSON data received"

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

                "error": "Caption is required"

            }), 400


        result = rewrite_caption(

            original_caption=original_caption,

            rewrite_style=rewrite_style,

            platform=platform

        )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as e:

        print(
            "REWRITE ERROR:"
        )

        print(str(e))


        return jsonify({

            "success": False,

            "error": str(e)

        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    app.run(

        debug=True,

        host="127.0.0.1",

        port=5000

    )