
import io
import re

from pypdf import PdfReader


SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md"}

DEFAULT_CHUNK_SIZE = 1000
DEFAULT_CHUNK_OVERLAP = 150


def extract_text(file_bytes, filename):
    """
    Extract text from PDF, TXT, or Markdown files.
    Returns the extracted text as a string.
    """

    if not filename:
        raise ValueError("A filename is required.")

    extension = "." + filename.rsplit(".", 1)[-1].lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            "Unsupported file type. Upload a PDF, TXT, or MD file."
        )

    if not file_bytes:
        raise ValueError("The uploaded file is empty.")

    if extension == ".pdf":
        try:
            reader = PdfReader(io.BytesIO(file_bytes))

            if reader.is_encrypted:
                raise ValueError(
                    "Password-protected PDFs are not supported."
                )

            pages = []

            for page in reader.pages:
                pages.append(page.extract_text() or "")

            text = "\n".join(pages)

        except ValueError:
            raise
        except Exception as error:
            raise ValueError(
                f"Unable to read the PDF: {error}"
            ) from error

    else:
        try:
            text = file_bytes.decode("utf-8-sig")
        except UnicodeDecodeError as error:
            raise ValueError(
                "The text file must use UTF-8 encoding."
            ) from error

    text = clean_text(text)

    if not text:
        raise ValueError(
            "No readable text was found in the document. "
            "Scanned PDFs may require OCR."
        )

    return text


def clean_text(text):
    """Normalize whitespace while preserving paragraph boundaries."""

    text = text.replace("\x00", "")
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    # Collapse repeated spaces and tabs.
    text = re.sub(r"[ \t]+", " ", text)

    # Limit excessive blank lines.
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()


def split_into_chunks(
    text,
    chunk_size=DEFAULT_CHUNK_SIZE,
    chunk_overlap=DEFAULT_CHUNK_OVERLAP,
):
    """
    Split text into overlapping chunks.

    chunk_size and chunk_overlap are measured in characters,
    not tokens.
    """

    if not text or not text.strip():
        raise ValueError("Text cannot be empty.")

    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if chunk_overlap < 0:
        raise ValueError("chunk_overlap cannot be negative.")

    if chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be smaller than chunk_size."
        )

    text = text.strip()
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = min(start + chunk_size, text_length)

        # Prefer ending at a word boundary when possible.
        if end < text_length:
            boundary = text.rfind(" ", start, end)

            if boundary > start + chunk_size // 2:
                end = boundary

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= text_length:
            break

        next_start = max(end - chunk_overlap, start + 1)

        # Avoid starting in the middle of a word.
        while (
            next_start < text_length
            and text[next_start].isspace()
        ):
            next_start += 1

        start = next_start

    return chunks


def process_document(file_bytes, filename):
    """
    Complete document-processing pipeline:
    extraction -> cleaning -> chunking.
    """

    text = extract_text(file_bytes, filename)
    chunks = split_into_chunks(text)

    return {
        "filename": filename,
        "character_count": len(text),
        "chunk_count": len(chunks),
        "chunks": chunks,
    }
