import { useState, useCallback } from 'react'
import axios from 'axios'

const STEPS = [
  'Fetching RSS feed data…',
  'Parsing episode transcripts…',
  'Analysing conversational context…',
  'Building audience psychographic map…',
  'Scraping sponsor databases…',
  'Scoring brand-audience fit…',
  'Generating personalised pitch assets…',
  'Finalising output…',
]

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyse = useCallback(async ({ rssUrl, file, refinement }) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStepIndex(0)

    // Animate through steps while the real request runs
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
    }, 1200)

    try {
      let response
      if (file) {
        const form = new FormData()
        form.append('file', file)
        if (refinement) form.append('refinement', refinement)
        response = await axios.post('/api/analyse', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        response = await axios.post('/api/analyse', { rss_url: rssUrl, refinement })
      }
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      clearInterval(stepTimer)
      setLoading(false)
    }
  }, [])

  return { loading, step: STEPS[stepIndex], stepIndex, totalSteps: STEPS.length, result, error, analyse }
}
