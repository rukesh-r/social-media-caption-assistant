
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


def list_documents(access_token):
    """
    Return a list of unique documents uploaded by the user,
    with chunk counts.
    """
    user_id = get_user_from_token(access_token)
    user_client = get_authenticated_client(access_token)

    response = (
        user_client
        .table("knowledge_chunks")
        .select("document_name, id")
        .eq("user_id", user_id)
        .execute()
    )

    rows = response.data or []

    counts = {}
    for row in rows:
        name = row["document_name"]
        counts[name] = counts.get(name, 0) + 1

    return [
        {"document_name": name, "chunk_count": count}
        for name, count in counts.items()
    ]


def delete_document(access_token, document_name):
    """
    Delete all chunks belonging to a document for the authenticated user.
    """
    user_id = get_user_from_token(access_token)
    user_client = get_authenticated_client(access_token)

    response = (
        user_client
        .table("knowledge_chunks")
        .delete()
        .eq("document_name", document_name)
        .eq("user_id", user_id)
        .execute()
    )

    return {"deleted_count": len(response.data or [])}
