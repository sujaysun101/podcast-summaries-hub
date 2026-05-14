"""
Data ingestion: RSS parsing, audio transcription, and text chunking.
"""
import re
import textwrap
from typing import Optional
import feedparser
import httpx
from openai import AsyncOpenAI

openai_client = AsyncOpenAI()

MAX_CHUNK_TOKENS = 3000
CHARS_PER_TOKEN = 4


async def parse_rss(rss_url: str) -> dict:
    """Fetch and parse an RSS feed, returning the latest episode metadata and description."""
    feed = feedparser.parse(rss_url)
    if not feed.entries:
        raise ValueError("No episodes found in RSS feed.")

    show = feed.feed
    latest = feed.entries[0]

    # Extract text content from description / summary
    raw_text = latest.get("summary", "") or latest.get("content", [{}])[0].get("value", "")
    clean_text = re.sub(r"<[^>]+>", " ", raw_text).strip()

    # Collect last 3 episodes for richer context
    corpus = []
    for entry in feed.entries[:3]:
        text = entry.get("summary", "") or ""
        text = re.sub(r"<[^>]+>", " ", text).strip()
        if text:
            corpus.append(text)

    return {
        "show_title": show.get("title", "Unknown Show"),
        "show_description": show.get("subtitle", show.get("summary", "")),
        "episode_title": latest.get("title", "Latest Episode"),
        "episode_text": clean_text,
        "corpus": "\n\n---\n\n".join(corpus),
    }


async def transcribe_audio(file_bytes: bytes, filename: str) -> str:
    """Transcribe an audio file using OpenAI Whisper-1."""
    import io
    audio_file = io.BytesIO(file_bytes)
    audio_file.name = filename

    transcription = await openai_client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text",
    )
    return transcription


def chunk_text(text: str, max_chars: Optional[int] = None) -> list[str]:
    """Split text into chunks suitable for LLM context windows."""
    max_chars = max_chars or (MAX_CHUNK_TOKENS * CHARS_PER_TOKEN)
    paragraphs = text.split("\n\n")
    chunks, current = [], ""

    for para in paragraphs:
        if len(current) + len(para) + 2 > max_chars:
            if current:
                chunks.append(current.strip())
            current = para
        else:
            current = f"{current}\n\n{para}" if current else para

    if current:
        chunks.append(current.strip())

    return chunks or [text[:max_chars]]
