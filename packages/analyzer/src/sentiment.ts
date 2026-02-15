import * as vader from 'vader-sentiment';

export interface SentimentResult {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
}

/**
 * Analyzes the sentiment of a given text using the VADER sentiment analyzer.
 * Returns a score between -1.0 (most negative) and 1.0 (most positive) and a label.
 * 
 * @param text - The text to analyze
 * @returns SentimentResult with score and label
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      label: 'neutral',
    };
  }

  const result = vader.SentimentIntensityAnalyzer.polarity_scores(text);
  const score = result.compound;

  let label: 'positive' | 'neutral' | 'negative';
  if (score > 0.05) {
    label = 'positive';
  } else if (score < -0.05) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return {
    score,
    label,
  };
}
