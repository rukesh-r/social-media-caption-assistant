<div align="center">

<img src="frontend/public/favicon.png" alt="CaptionCraft AI Logo" width="80" />

# CaptionCraft AI

### AI-Powered Social Media Caption Studio

Generate · Rewrite · Analyze · Knowledge RAG

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Gemini-Flash%20Lite-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

</div>

---

## Overview

CaptionCraft AI is a full-stack intelligent content studio that helps creators, founders, and brands produce high-converting social media captions in seconds. Powered by **Google Gemini**, it goes beyond simple text generation — it can analyze uploaded images, rewrite existing captions in different styles, score caption quality, and generate personalized captions grounded in your own uploaded documents using **Retrieval-Augmented Generation (RAG)**.

---

## Features

### Caption Studio — Generate
- Generate captions from a text topic or by uploading an image
- Platform-specific formatting for **Instagram**, **LinkedIn**, **Facebook**, and **X (Twitter)**
- Select tone: Casual, Professional, Funny, Inspirational, Exciting, Promotional
- Target audience: General, Professionals, Founders, Gen-Z, Customers
- Caption length: Short, Medium, Long
- Returns: main caption, 3 alternative hooks, 10 hashtags, emojis, and a call-to-action
- One-click send to Rewriter or Analyzer

### Caption Rewriter
- Paste any existing caption and transform it
- Six rewrite objectives: More Engaging, Professional, Viral Humor, Inspirational, Punchy & Short, Emoji Polish
- Returns: refined caption, 3 variations, and suggested hashtags

### Caption Quality Analyzer
- Paste a caption and get a full engagement diagnostic
- AI-scored from 0–100 with a grade (Excellent / Good / Average / Needs Improvement)
- Diagnostic metrics: Readability, Tone, Engagement, Hook Strength, CTA, Hashtag Quality, Clarity, Audience Appeal
- 3 specific, actionable improvement suggestions

### Knowledge RAG (Retrieval-Augmented Generation)
- Upload your own documents (PDF, DOCX, TXT) as a personal knowledge base
- Captions are grounded in your brand guidelines, product info, or style docs
- Uses vector embeddings (sentence-transformers) + FAISS similarity search stored in Supabase
- Prevents hallucinations by explicitly grounding responses in retrieved context

### Caption History
- All generated, rewritten, and analyzed captions are saved per user
- View and delete history from the dashboard
- Persisted in Supabase with per-user authentication

### Authentication
- Supabase Auth (email + password) with session management
- All API routes are protected by Bearer token authentication

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client for API calls |
| Supabase JS | Authentication & client-side session |

### Backend

| Technology | Purpose |
|---|---|
| Flask 3.1 | REST API server |
| Flask-CORS | Cross-origin request handling |
| Google Generative AI (`google-genai`) | Gemini Flash Lite model |
| Supabase Python | Database, auth, and vector storage |
| Sentence Transformers | Text embedding for RAG |
| FAISS | Vector similarity search |
| PyMuPDF / python-docx | PDF and DOCX document parsing |
| spaCy | NLP text chunking |
| Gunicorn | Production WSGI server |

---

## Project Structure

```
CaptionCraft-AI/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx              # Main dashboard (tabs, state, API calls)
│   │   ├── Auth.jsx             # Login / signup screen
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── HeroSection.jsx      # Landing page hero with live mockup
│   │   ├── BrandLogo.jsx        # Logo component (SVG icon + wordmark)
│   │   ├── History.jsx          # Caption history tab
│   │   ├── RagGenerator.jsx     # Knowledge RAG tab UI
│   │   ├── InsaneInput.jsx      # Custom form components
│   │   ├── Icons.jsx            # Lucide-style icon set
│   │   ├── supabaseClient.js    # Supabase client initialization
│   │   └── index.css            # Global styles
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Flask REST API
│   ├── app.py                   # Routes: generate, rewrite, analyze, history
│   ├── services/
│   │   ├── ai_service.py        # Gemini API wrappers (all 4 AI features)
│   │   └── database.py          # Supabase DB helpers (history, auth)
│   ├── rag/
│   │   ├── document_processor.py   # PDF / DOCX / TXT text extraction & chunking
│   │   ├── embedding_service.py    # Sentence-transformer embeddings
│   │   ├── knowledge_service.py    # Store, list, delete user documents
│   │   ├── retrieval_service.py    # Vector similarity retrieval
│   │   ├── generation_service.py   # RAG-grounded caption generation
│   │   ├── storage_routes.py       # /rag/upload, /rag/documents, /rag/delete
│   │   ├── retrieval_routes.py     # /rag/retrieve (similarity search)
│   │   └── generation_routes.py    # /rag/generate (RAG caption endpoint)
│   ├── requirements.txt
│   └── .env                     # Environment variables (not committed)
│
└── README.md
```

---

## API Reference

### Caption Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/generate-caption` | Generate caption from text topic |
| `POST` | `/generate-image-caption` | Generate caption from uploaded image |
| `POST` | `/rewrite-caption` | Rewrite an existing caption |
| `POST` | `/analyze-caption` | Score and analyze caption quality |
| `GET` | `/history` | Get user's caption history |
| `DELETE` | `/history/<id>` | Delete a history entry |

### RAG Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/rag/upload` | Upload and embed a document |
| `GET` | `/rag/documents` | List uploaded documents |
| `DELETE` | `/rag/delete` | Delete a document |
| `POST` | `/rag/retrieve` | Retrieve relevant chunks |
| `POST` | `/rag/generate` | Generate a RAG-grounded caption |

All endpoints except `GET /` require an `Authorization: Bearer <token>` header.

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CaptionCraft-AI.git
cd CaptionCraft-AI
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```env
GEMINI_API_KEY=your_google_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
```

Start the Flask server:

```bash
python app.py
```

The backend runs on `http://127.0.0.1:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

### 4. Supabase Setup

In your Supabase project, create the following tables:

**`caption_history`**
```sql
create table caption_history (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  type text,
  platform text,
  input_text text,
  result jsonb,
  created_at timestamp with time zone default now()
);
```

**`knowledge_chunks`**
```sql
create table knowledge_chunks (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  document_name text,
  chunk_text text,
  embedding vector(384),
  metadata jsonb,
  created_at timestamp with time zone default now()
);
```

Enable the `pgvector` extension in Supabase (Database → Extensions → `vector`).

Also create a vector similarity search function:

```sql
create or replace function match_knowledge_chunks(
  query_embedding vector(384),
  match_count int,
  match_threshold float,
  p_user_id uuid
)
returns table (
  id bigint,
  document_name text,
  chunk_text text,
  similarity float
)
language sql stable
as $$
  select
    id,
    document_name,
    chunk_text,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where user_id = p_user_id
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

---

## Environment Variables Summary

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Supabase service role key (for server-side operations) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

---

## How It Works

```
User Input
    │
    ▼
React Frontend (Vite)
    │  HTTP / FormData
    ▼
Flask REST API (app.py)
    │
    ├── Text/Image → ai_service.py → Gemini Flash Lite → JSON response
    │
    ├── Rewrite    → ai_service.py → Gemini Flash Lite → JSON response
    │
    ├── Analyze    → ai_service.py → Gemini Flash Lite → scored JSON
    │
    └── RAG Generate
            │
            ├── retrieval_service.py
            │       └── sentence-transformers → embed query
            │           └── Supabase pgvector → top-K chunks
            │
            └── generation_service.py
                    └── Gemini Flash Lite (grounded prompt) → JSON response
```

---

## Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint linter |

### Backend

| Command | Description |
|---|---|
| `python app.py` | Start development server |
| `gunicorn app:app` | Start production server |

---

## Team

Built by:

- **Rasetty Rukesh**
- **T Karthik**
- **M Nithin Rao**
- **P Dinesh Kumar Reddy**
- **G Rama Krishna**

---

## Academic Credit

> Built under the course of **Generative AI – Artificial Intelligence**  
> with the mentorship of **Shirwin Prince** from **Infoziant**

---

<div align="center">

CaptionCraft AI &copy; 2026 · All rights reserved.

</div>
