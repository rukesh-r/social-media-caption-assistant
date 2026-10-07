import os
import json
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)


def generate_caption(topic, platform, tone, audience, keywords, length):

    prompt = f"""
You are an expert social media content creator.

Generate personalized social media content using these details:

Topic: {topic}
Platform: {platform}
Tone: {tone}
Target Audience: {audience}
Keywords: {keywords}
Caption Length: {length}

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
- Make the content appropriate for the target audience.
- Use the provided keywords naturally.
- Do not add markdown.
- Do not add explanations outside the JSON.
"""

    # Retry temporary Gemini failures
    max_attempts = 3

    for attempt in range(max_attempts):

        try:

            response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=prompt,
                config={
                    "response_mime_type": "application/json"
                }
)

            result = response.text.strip()

            # Remove markdown code fences if present
            if result.startswith("```json"):
                result = result[7:]

            elif result.startswith("```"):
                result = result[3:]

            if result.endswith("```"):
                result = result[:-3]

            result = result.strip()

            return json.loads(result)

        except Exception as e:

            error_message = str(e)

            # Retry only temporary availability errors
            if "503" in error_message or "UNAVAILABLE" in error_message:

                if attempt < max_attempts - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini temporarily unavailable. "
                        f"Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                else:

                    raise Exception(
                        "Gemini is temporarily unavailable. "
                        "Please try again after a few seconds."
                    )

            else:
                raise e