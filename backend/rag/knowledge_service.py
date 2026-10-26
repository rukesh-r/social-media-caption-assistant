
from rag.document_processor import process_document
from rag.embedding_service import generate_embeddings
from services.database import get_user_from_token, get_authenticated_client


def store_document(file_bytes, filename, access_token):
    """
    Process a document, generate embeddings, and store
    its chunks in Supabase for the authenticated user.
    """

    if not access_token:
        raise ValueError("Authentication is required.")

    user_id = get_user_from_token(access_token)

    processed = process_document(
        file_bytes=file_bytes,
        filename=filename,
    )

    chunks = processed["chunks"]
    embeddings = generate_embeddings(chunks)

    user_client = get_authenticated_client(access_token)

    rows = []

    for chunk, embedding in zip(chunks, embeddings):
        rows.append({
            "user_id": user_id,
            "document_name": filename,
            "chunk_text": chunk,
            "embedding": embedding,
            "metadata": {
                "character_count": len(chunk)
            }
        })

    response = (
        user_client
        .table("knowledge_chunks")
        .insert(rows)
        .execute()
    )

    return {
        "filename": filename,
        "character_count": processed["character_count"],
        "chunk_count": len(chunks),
        "stored_count": len(response.data or [])
    }
