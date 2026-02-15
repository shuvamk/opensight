export interface VisibilityParams {
  mentioned: boolean;
  position: number | null;
  sentimentScore: number;
  hasCitation: boolean;
  competitorCount: number;
}

/**
 * Calculates a visibility score based on mention, position, sentiment, citation, and competitor metrics.
 * Score ranges from 0 to 100.
 * 
 * Scoring logic:
 * - Mentioned: +40 points
 * - Position bonus: +20 points if position 1, degrades for later positions
 * - Positive sentiment: +15 points
 * - Citation present: +15 points
 * - Fewer competitor mentions: +10 points (bonus if competitors < 3)
 * 
 * @param params - Visibility parameters
 * @returns Score between 0 and 100
 */
export function calculateVisibilityScore(params: VisibilityParams): number {
  let score = 0;

  // Base score for mention
  if (params.mentioned) {
    score += 40;

    // Position bonus (degrades for later positions)
    if (params.position !== null && params.position > 0) {
      const positionBonus = Math.max(0, 20 - (params.position - 1) * 2);
      score += positionBonus;
    }
  }

  // Sentiment bonus
  if (params.sentimentScore > 0.05) {
    score += 15;
  }

  // Citation bonus
  if (params.hasCitation) {
    score += 15;
  }

  // Competitor mentioning bonus (fewer competitors = higher score)
  if (params.competitorCount < 3) {
    score += 10;
  }

  // Cap the score at 100
  return Math.min(score, 100);
}
