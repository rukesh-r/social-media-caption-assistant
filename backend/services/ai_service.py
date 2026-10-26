import os
import json

from dotenv import load_dotenv
from google import genai


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")


if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is not configured in .env"
    )


client = genai.Client(
    api_key=api_key
)


# ============================================================
# JSON RESPONSE PARSER
# ============================================================

def parse_json_response(text):

    result = text.strip()

    # Remove markdown code fences
    if result.startswith("```json"):
        result = result[7:]

    elif result.startswith("```"):
        result = result[3:]

    if result.endswith("```"):
        result = result[:-3]

    result = result.strip()

    try:
        return json.loads(result)

    except json.JSONDecodeError as e:
        raise Exception(
            f"Gemini returned invalid JSON: {str(e)}"
        )


# ============================================================
# TEXT CAPTION GENERATION
# ============================================================

def generate_caption(
    topic,
    platform,
    tone,
    audience,
    keywords,
    length
):

    prompt = f"""
You are an expert social media content creator.

Generate personalized social media content.

Topic:
{topic}

Platform:
{platform}

Tone:
{tone}

Target Audience:
{audience}

Keywords:
{keywords}

Caption Length:
{length}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "caption": "main caption",
    "alternatives": [
        "alternative caption 1",
        "alternative caption 2",
        "alternative caption 3"
    ],
    "hashtags": [
        "#hashtag1",
        "#hashtag2",
        "#hashtag3",
        "#hashtag4",
        "#hashtag5",
        "#hashtag6",
        "#hashtag7",
        "#hashtag8",
        "#hashtag9",
        "#hashtag10"
    ],
    "emojis": [
        "emoji1",
        "emoji2",
        "emoji3"
    ],
    "call_to_action": "short call to action"
}}

Requirements:

- Make the caption natural and engaging.
- Follow the selected platform style.
- Follow the selected tone.
- Make it appropriate for the target audience.
- Use the keywords naturally.
- Do not use markdown.
- Do not add explanations outside JSON.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return parse_json_response(
        response.text
    )


# ============================================================
# IMAGE CAPTION GENERATION
# ============================================================

def generate_image_caption(
    image,
    platform,
    tone,
    audience,
    length
):

    image_bytes = image.read()

    prompt = f"""
You are an expert social media content creator
and image understanding AI.

Analyze the uploaded image carefully.

Understand:

- Main subject
- People or objects
- Environment
- Activity
- Mood
- Visible context
- Important visual details

Then create social media content based on the image.

Platform:
{platform}

Tone:
{tone}

Target Audience:
{audience}

Caption Length:
{length}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "caption": "main caption",
    "alternatives": [
        "alternative caption 1",
        "alternative caption 2",
        "alternative caption 3"
    ],
    "hashtags": [
        "#hashtag1",
        "#hashtag2",
        "#hashtag3",
        "#hashtag4",
        "#hashtag5",
        "#hashtag6",
        "#hashtag7",
        "#hashtag8",
        "#hashtag9",
        "#hashtag10"
    ],
    "emojis": [
        "emoji1",
        "emoji2",
        "emoji3"
    ],
    "call_to_action": "short call to action"
}}

Important:

- Base captions on what is visible.
- Do not invent names or locations.
- Do not invent facts.
- Make captions natural.
- Follow the selected platform.
- Follow the selected tone.
- Do not add explanations outside JSON.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            {
                "text": prompt
            },
            {
                "inline_data": {
                    "mime_type": image.content_type,
                    "data": image_bytes
                }
            }
        ]
    )

    return parse_json_response(
        response.text
    )


# ============================================================
# CAPTION REWRITER
# ============================================================

def rewrite_caption(
    original_caption,
    rewrite_style,
    platform
):

    prompt = f"""
You are an expert social media content editor.

Rewrite the user's existing social media caption.

Original Caption:
{original_caption}

Rewrite Style:
{rewrite_style}

Platform:
{platform}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "rewritten_caption": "improved caption",
    "alternative_versions": [
        "alternative version 1",
        "alternative version 2",
        "alternative version 3"
    ],
    "hashtags": [
        "#hashtag1",
        "#hashtag2",
        "#hashtag3",
        "#hashtag4",
        "#hashtag5"
    ]
}}

Rules:

- Preserve the original meaning.
- Do not invent facts.
- Improve grammar and readability.
- Follow the requested rewrite style.
- Adapt the caption to the selected platform.
- Make it natural.
- Make it engaging.
- Return only JSON.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return parse_json_response(
        response.text
    )


# ============================================================
# CAPTION QUALITY & ENGAGEMENT ANALYZER
# ============================================================

def analyze_caption(
    caption,
    platform
):

    prompt = f"""
You are an expert social media content analyst.

Analyze the following social media caption.

Caption:
{caption}

Platform:
{platform}

Evaluate the caption based on:

1. Overall quality
2. Readability
3. Tone
4. Engagement potential
5. Opening hook
6. Call to action
7. Hashtag quality
8. Content clarity
9. Audience appeal

Return ONLY valid JSON.

Use exactly this structure:

{{
    "score": 82,
    "grade": "Excellent",
    "readability": "Good",
    "tone": "Positive",
    "engagement": "High",
    "hook": "Strong",
    "cta": "Moderate",
    "hashtag_quality": "Good",
    "clarity": "Excellent",
    "audience_appeal": "High",
    "suggestions": [
        "Add a stronger opening hook",
        "Use a more specific call to action",
        "Add more relevant hashtags"
    ]
}}

Rules:

- Score must be between 0 and 100.
- Grade must be one of:
  Excellent
  Good
  Average
  Needs Improvement

- Readability should describe how easy the caption is to understand.
- Tone should identify the emotional communication style.
- Engagement should estimate the potential to encourage interaction.
- Hook should evaluate the opening sentence.
- CTA should evaluate the call to action.
- Hashtag quality should evaluate hashtag relevance and usefulness.
- Clarity should evaluate how clearly the message is communicated.
- Audience appeal should evaluate how attractive the caption is to its intended audience.
- Provide exactly 3 useful suggestions.
- Suggestions must be specific and actionable.
- Do not invent information.
- Return only valid JSON.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return parse_json_response(
        response.text
    )