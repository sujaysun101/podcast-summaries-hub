"""
YieldCast API — FastAPI entry point.
"""
import os
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from dotenv import load_dotenv

from ingestion import parse_rss, transcribe_audio, chunk_text
from ai_core import analyse_podcast, refine_analysis

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Validate env vars on startup
    missing = [k for k in ("ANTHROPIC_API_KEY",) if not os.getenv(k)]
    if missing:
        print(f"WARNING: Missing env vars: {', '.join(missing)}")
    yield


app = FastAPI(title="YieldCast API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyseRequest(BaseModel):
    rss_url: Optional[str] = None
    refinement: Optional[str] = None


class RefineRequest(BaseModel):
    previous_result: dict
    refinement: str
    show_title: Optional[str] = "Unknown Show"


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyse")
async def analyse(
    rss_url: Optional[str] = Form(None),
    refinement: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
):
    """
    Accept either an RSS URL or an audio file upload.
    Returns the full structured analysis JSON.
    """
    content = ""
    show_title = "Unknown Show"

    if file:
        audio_bytes = await file.read()
        try:
            content = await transcribe_audio(audio_bytes, file.filename or "audio.mp3")
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Transcription failed: {e}")
        show_title = file.filename or "Uploaded Episode"

    elif rss_url:
        try:
            rss_data = await parse_rss(rss_url)
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"RSS parsing failed: {e}")

        show_title = rss_data["show_title"]
        # Use corpus (multi-episode) for richer analysis
        content = rss_data["corpus"] or rss_data["episode_text"]

    else:
        raise HTTPException(status_code=400, detail="Provide either rss_url or an audio file.")

    if not content.strip():
        raise HTTPException(status_code=422, detail="No analysable content found.")

    # Chunk and use the first (largest) chunk to stay within context
    chunks = chunk_text(content)
    primary_chunk = chunks[0]

    try:
        result = await analyse_podcast(
            content=primary_chunk,
            show_title=show_title,
            refinement=refinement,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")

    return result


@app.post("/api/analyse/json")
async def analyse_json(body: AnalyseRequest):
    """JSON body variant for RSS-only requests (no file upload)."""
    if not body.rss_url:
        raise HTTPException(status_code=400, detail="rss_url is required.")

    try:
        rss_data = await parse_rss(body.rss_url)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"RSS parsing failed: {e}")

    content = rss_data["corpus"] or rss_data["episode_text"]
    chunks = chunk_text(content)

    try:
        result = await analyse_podcast(
            content=chunks[0],
            show_title=rss_data["show_title"],
            refinement=body.refinement,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {e}")

    return result


@app.post("/api/refine")
async def refine(body: RefineRequest):
    """
    Refinement loop: regenerate brand matches with a new user constraint.
    """
    try:
        result = await refine_analysis(
            previous_result=body.previous_result,
            refinement=body.refinement,
            show_title=body.show_title,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refinement failed: {e}")

    return result
