"""
AI orchestration: prompt engineering, brand matching, pitch generation,
and the refinement feedback loop.
"""
import json
import re
from typing import Optional
import anthropic

client = anthropic.AsyncAnthropic()
MODEL = "claude-opus-4-7"

SYSTEM_PROMPT = """You are an elite podcast monetization expert and media buyer with 15 years of experience placing brands inside niche audio content.

Your goal is to analyse the provided podcast transcript or show notes, determine the exact demographic and psychographic profile of the listener, and identify 10 highly relevant, niche brands that would benefit from sponsoring this specific content.

You think in terms of audience intent, purchase readiness, and brand-audience resonance — not just surface-level topic alignment. You know that a 10,000-download show with a hyper-engaged niche audience is worth more to the right brand than a 500,000-download general interest show.

Always return a single valid JSON object — no markdown fences, no commentary before or after."""

OUTPUT_SCHEMA = """
Return ONLY a JSON object with exactly this structure (no extra keys, no markdown):
{
  "audience_profile": {
    "age_range": "string",
    "primary_interests": ["string"],
    "values": "string",
    "income_bracket": "string",
    "purchase_behaviour": "string",
    "content_themes": "string",
    "engagement_style": "string"
  },
  "brand_matches": [
    {
      "name": "string",
      "category": "string",
      "fit_score": 0,
      "reason": "string",
      "contact": "string (plausible sponsorship email)"
    }
  ],
  "pitch_emails": [
    "full pitch email as a plain string for each of the top 3 brands"
  ]
}

brand_matches must contain exactly 10 entries, ordered by fit_score descending (0–100).
pitch_emails must contain exactly 3 entries corresponding to the top 3 brand_matches.
"""


def _build_user_prompt(content: str, show_title: str, refinement: Optional[str]) -> str:
    refinement_block = ""
    if refinement:
        refinement_block = f"\n\nADDITIONAL CONSTRAINT FROM USER: {refinement}\nApply this constraint when selecting and ranking brand matches."

    return f"""Podcast show: {show_title}

Content to analyse:
{content}
{refinement_block}

{OUTPUT_SCHEMA}"""


def _extract_json(text: str) -> dict:
    """Extract the first JSON object from a model response."""
    # Strip markdown fences if present
    text = re.sub(r"```(?:json)?", "", text).strip()
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError("No JSON object found in model response.")
    return json.loads(match.group())


async def analyse_podcast(
    content: str,
    show_title: str = "Unknown Show",
    refinement: Optional[str] = None,
) -> dict:
    """
    Core analysis call. Returns the structured JSON result.
    """
    user_prompt = _build_user_prompt(content, show_title, refinement)

    message = await client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    raw = message.content[0].text
    return _extract_json(raw)


async def refine_analysis(
    previous_result: dict,
    refinement: str,
    show_title: str = "Unknown Show",
) -> dict:
    """
    Feedback loop: takes an existing result and user constraint, regenerates brand matches and pitches.
    """
    previous_json = json.dumps(previous_result, indent=2)

    messages = [
        {
            "role": "user",
            "content": f"""Here is a previous analysis result:

{previous_json}

The user has provided a new constraint: "{refinement}"

Regenerate the brand_matches (10 entries) and pitch_emails (3 entries) applying this constraint.
Keep audience_profile unchanged.

{OUTPUT_SCHEMA}""",
        }
    ]

    message = await client.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    raw = message.content[0].text
    return _extract_json(raw)
