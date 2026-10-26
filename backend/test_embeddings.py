
from rag.embedding_service import generate_embedding

sample_text = (
    "CaptionCraft AI creates personalized social media "
    "captions using brand guidelines and audience preferences."
)

try:
    vector = generate_embedding(sample_text)

    print("\nEmbedding generated successfully!")
    print("Vector dimensions:", len(vector))
    print("First 5 values:", vector[:5])

except Exception as error:
    print("\nEmbedding generation failed:")
    print(error)
