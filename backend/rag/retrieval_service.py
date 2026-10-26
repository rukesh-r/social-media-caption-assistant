
from rag.embedding_service import generate_embedding
from services.database import (
    get_user_from_token,
    get_authenticated_client,
)


def retrieve_relevant_chunks(
    query,
    access_token,
    match_count=5,
    match_threshold=0.30,
):
    """
    Find relevant document chunks for the authenticated user.
    """

    if not query or not query.strip():
        raise ValueError("Search query cannot be empty.")

    if not access_token:
        raise ValueError("Authentication is required.")

    # Validate the token before accessing the knowledge base.
    get_user_from_token(access_token)

    # Generate a query embedding using the same model as stored chunks.
    query_embedding = generate_embedding(query)

    user_client = get_authenticated_client(access_token)

    response = user_client.rpc(
        "match_knowledge_chunks",
        {
            "query_embedding": query_embedding,
            "match_threshold": match_threshold,
            "match_count": match_count,
        },
    ).execute()

    results = response.data or []

    return [
        {
            "id": item["id"],
            "document_name": item["document_name"],
            "chunk_text": item["chunk_text"],
            "similarity": item["similarity"],
            "metadata": item.get("metadata") or {},
        }
        for item in results
    ]
