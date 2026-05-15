# YieldCast

AI-powered sponsor matching for independent podcasters.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Python 3.11 + FastAPI |
| AI Core | Anthropic Claude (analysis) + OpenAI Whisper (transcription) |

## Quick start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/analyse` | Analyse RSS feed or audio file (multipart) |
| POST | `/api/analyse/json` | Analyse RSS feed (JSON body) |
| POST | `/api/refine` | Re-run brand matching with a new constraint |
| GET | `/health` | Health check |

## Environment variables

```
ANTHROPIC_API_KEY   — Claude API key (required)
OPENAI_API_KEY      — OpenAI key for Whisper (required for audio uploads)
```
