
import os

from dotenv import load_dotenv
from supabase import create_client
from supabase.client import ClientOptions

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from backend/.env")

if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is missing from backend/.env")

# Create the default Supabase client used to validate tokens.
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

def get_user_from_token(access_token):
    if not access_token:
        raise ValueError("Authentication token is required.")

    try:
        response = supabase.auth.get_user(jwt=access_token)

        user = getattr(response, "user", None)

        if not user:
            raise ValueError("Invalid or expired token.")

        user_id = getattr(user, "id", None)

        if not user_id:
            raise ValueError("User ID is missing from token.")

        return user_id

    except Exception as error:
        raise ValueError(
            f"Authentication failed: {error}"
        ) from error

def get_authenticated_client(access_token):
    if not access_token:
        raise ValueError("Authentication token is required.")

    return create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(
            headers={
                "Authorization": f"Bearer {access_token}"
            }
        )
    )

def save_history(
    access_token,
    history_type,
    platform,
    input_text,
    result
):
    user_id = get_user_from_token(access_token)
    user_client = get_authenticated_client(access_token)

    response = (
        user_client
        .table("caption_history")
        .insert({
            "user_id": user_id,
            "type": history_type,
            "platform": platform,
            "input_text": input_text,
            "result": result
        })
        .execute()
    )

    return response.data


def get_history(access_token):
    user_id = get_user_from_token(access_token)
    user_client = get_authenticated_client(access_token)

    response = (
        user_client
        .table("caption_history")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data


def delete_history(access_token, history_id):
    user_id = get_user_from_token(access_token)
    user_client = get_authenticated_client(access_token)

    response = (
        user_client
        .table("caption_history")
        .delete()
        .eq("id", history_id)
        .eq("user_id", user_id)
        .execute()
    )

    return response.data