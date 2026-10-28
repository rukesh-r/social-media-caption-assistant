
import os
import sys
import json

import streamlit as st

# Make backend imports work when this file is run by Streamlit Cloud.
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Streamlit Cloud secrets must be loaded before importing AI/database
# modules, because those modules read environment variables at import time.
try:
    for key in ("GEMINI_API_KEY", "SUPABASE_URL", "SUPABASE_KEY"):
        value = st.secrets.get(key)
        if value:
            os.environ[key] = str(value)

    missing = [
        key
        for key in ("GEMINI_API_KEY", "SUPABASE_URL", "SUPABASE_KEY")
        if not os.environ.get(key)
    ]
    if missing:
        st.error(
            "Missing Streamlit secrets: "
            + ", ".join(missing)
            + ". Configure them in Streamlit Cloud Settings > Secrets."
        )
        st.stop()

    from services.ai_service import (
        generate_caption,
        generate_image_caption,
        rewrite_caption,
        analyze_caption,
    )
    from services.database import (
        supabase,
        save_history,
        get_history,
        delete_history,
    )
    from rag.generation_service import generate_rag_caption

except Exception as exc:
    st.error(f"Application initialization failed: {exc}")
    st.stop()


st.set_page_config(
    page_title="CaptionCraft-AI",
    page_icon="✍️",
    layout="wide",
)

# ---------------------------------------------------------
# SESSION STATE
# ---------------------------------------------------------
if "access_token" not in st.session_state:
    st.session_state.access_token = None

if "user_email" not in st.session_state:
    st.session_state.user_email = None


def login():
    st.title("CaptionCraft-AI")
    st.subheader("Sign in")

    with st.form("login_form"):
        email = st.text_input("Email")
        password = st.text_input("Password", type="password")
        submitted = st.form_submit_button(
            "Sign in",
            type="primary",
            use_container_width=True,
        )

    if submitted:
        if not email.strip() or not password:
            st.warning("Enter your email and password.")
            return

        try:
            response = supabase.auth.sign_in_with_password(
                {
                    "email": email.strip(),
                    "password": password,
                }
            )

            session = response.session
            if not session or not session.access_token:
                st.error("Login did not return a valid session.")
                return

            st.session_state.access_token = session.access_token
            st.session_state.user_email = email.strip()
            st.rerun()

        except Exception:
            st.error("Sign-in failed. Check your credentials and Supabase Auth settings.")


def record_history(history_type, platform, input_text, result):
    """Save results against the authenticated user's Supabase account."""
    try:
        save_history(
            st.session_state.access_token,
            history_type,
            platform,
            input_text,
            result,
        )
    except Exception as exc:
        st.warning(f"Result generated, but history could not be saved: {exc}")


def show_result(result):
    st.success("Completed!")
    st.json(result)

    if isinstance(result, dict) and result.get("caption"):
        st.text_area(
            "Main caption — copy from here",
            value=result["caption"],
            height=130,
            key=f"copy_caption_{st.session_state.get('result_counter', 0)}",
        )


# ---------------------------------------------------------
# AUTHENTICATION GATE
# ---------------------------------------------------------
if not st.session_state.access_token:
    login()
    st.stop()


# ---------------------------------------------------------
# MAIN APP
# ---------------------------------------------------------
st.title("✍️ CaptionCraft-AI")
st.caption("AI-powered social media caption assistant")

st.sidebar.write(f"Signed in as: {st.session_state.user_email}")

if st.sidebar.button("Sign out", use_container_width=True):
    st.session_state.access_token = None
    st.session_state.user_email = None
    st.rerun()


tab_text, tab_image, tab_rewrite, tab_analyze, tab_rag, tab_history = (
    st.tabs(
        [
            "Text Caption",
            "Image Caption",
            "Rewrite",
            "Quality Analyzer",
            "RAG Caption",
            "History",
        ]
    )
)

PLATFORMS = [
    "Instagram",
    "Facebook",
    "LinkedIn",
    "X",
    "YouTube",
    "TikTok",
]

TONES = [
    "Professional",
    "Friendly",
    "Funny",
    "Inspirational",
    "Casual",
    "Persuasive",
]

AUDIENCES = [
    "General audience",
    "Students",
    "Professionals",
    "Customers",
    "Entrepreneurs",
    "Content creators",
]

LENGTHS = ["Short", "Medium", "Long"]


# ---------------------------------------------------------
# TEXT CAPTION GENERATOR
# ---------------------------------------------------------
with tab_text:
    st.subheader("Generate a caption")

    with st.form("text_caption_form"):
        topic = st.text_input("Topic or product")
        platform = st.selectbox("Platform", PLATFORMS, key="text_platform")
        tone = st.selectbox("Tone", TONES, key="text_tone")
        audience = st.selectbox("Target audience", AUDIENCES)
        keywords = st.text_input("Keywords (optional)")
        length = st.selectbox("Caption length", LENGTHS, key="text_length")

        submit = st.form_submit_button("Generate caption", type="primary")

    if submit:
        if not topic.strip():
            st.warning("Enter a topic first.")
        else:
            try:
                with st.spinner("Generating caption..."):
                    result = generate_caption(
                        topic, platform, tone, audience, keywords, length
                    )
                record_history("text_caption", platform, topic, result)
                show_result(result)
            except Exception as exc:
                st.error(f"Caption generation failed: {exc}")


# ---------------------------------------------------------
# IMAGE CAPTION GENERATOR
# ---------------------------------------------------------
with tab_image:
    st.subheader("Generate a caption from an image")

    image = st.file_uploader(
        "Upload an image",
        type=["png", "jpg", "jpeg", "webp"],
        key="caption_image",
    )

    with st.form("image_caption_form"):
        image_platform = st.selectbox(
            "Platform", PLATFORMS, key="image_platform"
        )
        image_tone = st.selectbox("Tone", TONES, key="image_tone")
        image_audience = st.selectbox(
            "Target audience", AUDIENCES, key="image_audience"
        )
        image_length = st.selectbox(
            "Caption length", LENGTHS, key="image_length"
        )
        image_submit = st.form_submit_button("Generate from image")

    if image_submit:
        if image is None:
            st.warning("Upload an image first.")
        else:
            try:
                image.seek(0)
                with st.spinner("Analyzing image..."):
                    result = generate_image_caption(
                        image,
                        image_platform,
                        image_tone,
                        image_audience,
                        image_length,
                    )
                record_history(
                    "image_caption",
                    image_platform,
                    f"Image: {image.name}",
                    result,
                )
                show_result(result)
            except Exception as exc:
                st.error(f"Image caption generation failed: {exc}")


# ---------------------------------------------------------
# CAPTION REWRITER
# ---------------------------------------------------------
with tab_rewrite:
    st.subheader("Rewrite an existing caption")

    with st.form("rewrite_form"):
        original = st.text_area("Original caption", height=140)
        rewrite_style = st.selectbox(
            "Rewrite style",
            [
                "More engaging",
                "Professional",
                "Funny",
                "Shorter",
                "More persuasive",
                "Inspirational",
            ],
        )
        rewrite_platform = st.selectbox(
            "Platform", PLATFORMS, key="rewrite_platform"
        )
        rewrite_submit = st.form_submit_button("Rewrite caption")

    if rewrite_submit:
        if not original.strip():
            st.warning("Enter a caption to rewrite.")
        else:
            try:
                with st.spinner("Rewriting caption..."):
                    result = rewrite_caption(
                        original, rewrite_style, rewrite_platform
                    )
                record_history(
                    "rewrite",
                    rewrite_platform,
                    original,
                    result,
                )
                show_result(result)
            except Exception as exc:
                st.error(f"Caption rewriting failed: {exc}")


# ---------------------------------------------------------
# CAPTION QUALITY ANALYZER
# ---------------------------------------------------------
with tab_analyze:
    st.subheader("Analyze caption quality")

    with st.form("analyze_form"):
        caption_to_analyze = st.text_area(
            "Caption to analyze", height=140
        )
        analyze_platform = st.selectbox(
            "Platform", PLATFORMS, key="analyze_platform"
        )
        analyze_submit = st.form_submit_button("Analyze caption")

    if analyze_submit:
        if not caption_to_analyze.strip():
            st.warning("Enter a caption to analyze.")
        else:
            try:
                with st.spinner("Analyzing caption..."):
                    result = analyze_caption(
                        caption_to_analyze, analyze_platform
                    )
                record_history(
                    "analysis",
                    analyze_platform,
                    caption_to_analyze,
                    result,
                )
                show_result(result)
            except Exception as exc:
                st.error(f"Caption analysis failed: {exc}")


# ---------------------------------------------------------
# RAG CAPTION GENERATOR
# ---------------------------------------------------------
with tab_rag:
    st.subheader("Generate using your knowledge base")
    st.info(
        "This uses documents already stored in your authenticated "
        "Supabase knowledge base. Document upload is not included here yet."
    )

    with st.form("rag_caption_form"):
        rag_topic = st.text_input("Topic", key="rag_topic")
        rag_platform = st.selectbox(
            "Platform", PLATFORMS, key="rag_platform"
        )
        rag_tone = st.selectbox("Tone", TONES, key="rag_tone")
        rag_audience = st.selectbox(
            "Target audience", AUDIENCES, key="rag_audience"
        )
        rag_keywords = st.text_input("Keywords", key="rag_keywords")
        rag_length = st.selectbox(
            "Caption length", LENGTHS, key="rag_length"
        )
        rag_submit = st.form_submit_button("Generate RAG caption")

    if rag_submit:
        if not rag_topic.strip():
            st.warning("Enter a topic first.")
        else:
            try:
                with st.spinner("Retrieving knowledge and generating..."):
                    result = generate_rag_caption(
                        topic=rag_topic,
                        platform=rag_platform,
                        tone=rag_tone,
                        audience=rag_audience,
                        keywords=rag_keywords,
                        length=rag_length,
                        access_token=st.session_state.access_token,
                    )
                record_history(
                    "rag_caption",
                    rag_platform,
                    rag_topic,
                    result,
                )
                show_result(result)

                metadata = result.get("rag_metadata", {})
                st.write("Retrieved sources")
                st.json(metadata)

            except Exception as exc:
                st.error(f"RAG generation failed: {exc}")


# ---------------------------------------------------------
# CAPTION HISTORY
# ---------------------------------------------------------
with tab_history:
    st.subheader("Your caption history")

    if st.button("Refresh history"):
        st.rerun()

    try:
        history_items = get_history(st.session_state.access_token)

        if not history_items:
            st.info("No saved history yet.")
        else:
            for item in history_items:
                title = (
                    f"{item.get('type', 'Result')} — "
                    f"{item.get('platform', 'Unknown platform')} — "
                    f"{item.get('created_at', '')}"
                )

                with st.expander(title):
                    st.write("Input")
                    st.write(item.get("input_text", ""))

                    st.write("Result")
                    result = item.get("result")
                    if isinstance(result, (dict, list)):
                        st.json(result)
                    else:
                        st.write(result)

                    if st.button(
                        "Delete this record",
                        key=f"delete_{item['id']}",
                    ):
                        try:
                            delete_history(
                                st.session_state.access_token,
                                item["id"],
                            )
                            st.success("History record deleted.")
                            st.rerun()
                        except Exception as exc:
                            st.error(f"Could not delete history: {exc}")

    except Exception as exc:
        st.error(f"Could not load history: {exc}")
