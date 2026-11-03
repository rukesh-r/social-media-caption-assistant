# security_test.py — Cross-User Security Tests for CaptionCraft AI
# Run from backend/ directory: python security_test.py
# Requires two real Supabase test accounts created in your project.

import os
from dotenv import load_dotenv
from supabase import create_client
from supabase.client import ClientOptions

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ── Replace with real test account credentials ──────────────
USER_A_EMAIL = "rukeshr07@gmail.com"
USER_A_PASSWORD = "12345678"
USER_B_EMAIL = "rasettyrukesh7@gmail.com"
USER_B_PASSWORD = "12345678"
# ────────────────────────────────────────────────────────────

base_client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_token(email, password):
    res = base_client.auth.sign_in_with_password({"email": email, "password": password})
    return res.session.access_token, res.user.id

def get_client(token):
    return create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
    )

passed = 0
failed = 0

def run_test(name, expected, fn):
    global passed, failed
    try:
        actual = fn()
        if actual == expected:
            print(f"  [PASS] {name}")
            passed += 1
        else:
            print(f"  [FAIL] {name}")
            print(f"         Expected : {expected}")
            print(f"         Got      : {actual}")
            failed += 1
    except Exception as e:
        print(f"  [FAIL] {name} — Exception: {e}")
        failed += 1

print("\n=== CaptionCraft AI Cross-User Security Tests ===\n")

token_a, uid_a = get_token(USER_A_EMAIL, USER_A_PASSWORD)
token_b, uid_b = get_token(USER_B_EMAIL, USER_B_PASSWORD)
client_a = get_client(token_a)
client_b = get_client(token_b)

print(f"User A: {uid_a}")
print(f"User B: {uid_b}\n")

# ── Seed data ────────────────────────────────────────────────
seed_a = client_a.table("caption_history").insert({
    "user_id": uid_a, "type": "generated", "platform": "Instagram",
    "input_text": "security test A", "result": {"caption": "test"}
}).execute()
record_id_a = seed_a.data[0]["id"]

kc_seed_a = client_a.table("knowledge_chunks").insert({
    "user_id": uid_a, "document_name": "test_doc_a.txt",
    "chunk_text": "test chunk A", "embedding": [0.0] * 768, "metadata": {}
}).execute()
chunk_id_a = kc_seed_a.data[0]["id"]

print(f"Seeded caption_history id={record_id_a} for User A")
print(f"Seeded knowledge_chunks id={chunk_id_a} for User A\n")

# ── caption_history tests ────────────────────────────────────
print("--- caption_history ---")

def t1():
    rows = client_a.table("caption_history").select("user_id").execute().data
    return all(r["user_id"] == uid_a for r in rows)
run_test("T1: User A views only own caption history", True, t1)

def t2():
    rows = client_b.table("caption_history").select("user_id").execute().data
    return all(r["user_id"] == uid_b for r in rows)
run_test("T2: User B views only own caption history", True, t2)

def t3():
    rows = client_b.table("caption_history").select("id").eq("id", record_id_a).execute().data
    return len(rows) == 0
run_test("T3: User B cannot read User A's caption history record", True, t3)

def t4():
    b_rec = client_b.table("caption_history").insert({
        "user_id": uid_b, "type": "generated", "platform": "Instagram",
        "input_text": "b test", "result": {"caption": "b"}
    }).execute()
    b_id = b_rec.data[0]["id"]
    client_a.table("caption_history").delete().eq("id", b_id).execute()
    still_exists = client_b.table("caption_history").select("id").eq("id", b_id).execute().data
    client_b.table("caption_history").delete().eq("id", b_id).execute()
    return len(still_exists) > 0
run_test("T4: User A cannot delete User B's caption history", True, t4)

def t7():
    try:
        client_a.table("caption_history").insert({
            "user_id": uid_b, "type": "generated", "platform": "Instagram",
            "input_text": "spoofed", "result": {}
        }).execute()
        return False
    except Exception:
        return True
run_test("T7: User A cannot insert record with User B's user_id", True, t7)

# ── knowledge_chunks tests ───────────────────────────────────
print("\n--- knowledge_chunks ---")

def t5():
    rows = client_a.table("knowledge_chunks").select("user_id").execute().data
    return all(r["user_id"] == uid_a for r in rows)
run_test("T5: User A views only own knowledge chunks", True, t5)

def t6():
    rows = client_b.table("knowledge_chunks").select("id").eq("id", chunk_id_a).execute().data
    return len(rows) == 0
run_test("T6: User B cannot read User A's knowledge chunk", True, t6)

def t8():
    try:
        client_a.table("knowledge_chunks").insert({
            "user_id": uid_b, "document_name": "evil.txt",
            "chunk_text": "evil", "embedding": [0.0] * 768, "metadata": {}
        }).execute()
        return False
    except Exception:
        return True
run_test("T8: User A cannot insert knowledge chunk for User B", True, t8)

# ── Unauthenticated access tests ─────────────────────────────
print("\n--- Unauthenticated access ---")

def t9a():
    anon = create_client(SUPABASE_URL, SUPABASE_KEY)
    rows = anon.table("caption_history").select("id").execute().data
    return len(rows) == 0
run_test("T9a: Unauthenticated user gets no caption_history rows", True, t9a)

def t9b():
    anon = create_client(SUPABASE_URL, SUPABASE_KEY)
    rows = anon.table("knowledge_chunks").select("id").execute().data
    return len(rows) == 0
run_test("T9b: Unauthenticated user gets no knowledge_chunks rows", True, t9b)

# ── Cleanup ──────────────────────────────────────────────────
client_a.table("caption_history").delete().eq("id", record_id_a).execute()
client_a.table("knowledge_chunks").delete().eq("id", chunk_id_a).execute()

print(f"\n=== Results: {passed} passed, {failed} failed ===\n")
