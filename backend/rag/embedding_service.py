
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is missing from backend/.env"
    )

client = genai.Client(api_key=API_KEY)

EMBEDDING_MODEL = "gemini-embedding-2"
EMBEDDING_DIMENSIONS = 768


def generate_embedding(text):
    """
    Convert one text string into a 768-dimensional vector.
    """

    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    response = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=EMBEDDING_DIMENSIONS
        ),
    )

    if not response.embeddings:
        raise RuntimeError(
            "Gemini did not return an embedding."
        )

    embedding = response.embeddings[0].values

    if len(embedding) != EMBEDDING_DIMENSIONS:
        raise RuntimeError(
            f"Expected {EMBEDDING_DIMENSIONS} dimensions, "
            f"but received {len(embedding)}."
        )

    return list(embedding)


def generate_embeddings(chunks):
    """
    Generate one embedding for each document chunk.
    """

    if not chunks:
        raise ValueError("No text chunks were provided.")

    embeddings = []

    for index, chunk in enumerate(chunks, start=1):
        print(
            f"Generating embedding for chunk "
            f"{index}/{len(chunks)}..."
        )

        embeddings.append(
            generate_embedding(chunk)
        )

    return embeddings
