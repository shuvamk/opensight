import { analyzeSentiment } from './sentiment';

export interface BrandMentionResult {
  mentioned: boolean;
  position: number | null;
  mentionCount: number;
}

export interface CompetitorMention {
  name: string;
  position: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Extracts mentions of a brand name and URL from text.
 * Performs case-insensitive search for both the brand name and the domain from the brand URL.
 * 
 * @param text - The text to search in
 * @param brandName - The name of the brand to search for
 * @param brandUrl - The URL of the brand (domain will be extracted)
 * @returns BrandMentionResult with mentioned status, position, and count
 */
export function extractMentions(
  text: string,
  brandName: string,
  brandUrl: string
): BrandMentionResult {
  if (!text || text.trim().length === 0) {
    return {
      mentioned: false,
      position: null,
      mentionCount: 0,
    };
  }

  const lowerText = text.toLowerCase();
  const lowerBrandName = brandName.toLowerCase();

  // Extract domain from URL
  let domain = '';
  try {
    const url = new URL(brandUrl);
    domain = url.hostname.toLowerCase().replace('www.', '');
  } catch {
    // If URL parsing fails, use the whole URL string
    domain = brandUrl.toLowerCase();
  }

  // Count mentions of brand name
  let mentionCount = 0;
  let position: number | null = null;

  // Search for brand name mentions
  let searchIndex = 0;
  while ((searchIndex = lowerText.indexOf(lowerBrandName, searchIndex)) !== -1) {
    mentionCount++;
    if (position === null) {
      // Calculate position (1-indexed paragraph/sentence position)
      position = lowerText.substring(0, searchIndex).split(/[\.\!\?\n]+/).length;
    }
    searchIndex += lowerBrandName.length;
  }

  // Search for domain mentions
  searchIndex = 0;
  while ((searchIndex = lowerText.indexOf(domain, searchIndex)) !== -1) {
    mentionCount++;
    if (position === null) {
      position = lowerText.substring(0, searchIndex).split(/[\.\!\?\n]+/).length;
    }
    searchIndex += domain.length;
  }

  return {
    mentioned: mentionCount > 0,
    position: position || null,
    mentionCount,
  };
}

/**
 * Extracts mentions of competitors from text and analyzes sentiment for each mention.
 * 
 * @param text - The text to search in
 * @param competitors - Array of competitor objects with name and url
 * @returns Array of competitor mentions with sentiment analysis
 */
export function extractCompetitorMentions(
  text: string,
  competitors: Array<{ name: string; url: string }>
): CompetitorMention[] {
  const mentions: CompetitorMention[] = [];

  if (!text || text.trim().length === 0 || competitors.length === 0) {
    return mentions;
  }

  const sentences = text.split(/[\.\!\?\n]+/).filter((s) => s.trim().length > 0);

  for (const competitor of competitors) {
    const mentionData = extractMentions(text, competitor.name, competitor.url);

    if (mentionData.mentioned && mentionData.position !== null) {
      // Find the sentence containing the mention and analyze its sentiment
      let sentenceIndex = mentionData.position - 1;
      if (sentenceIndex < 0) sentenceIndex = 0;
      if (sentenceIndex >= sentences.length) sentenceIndex = sentences.length - 1;

      const sentenceWithMention = sentences[sentenceIndex];
      const sentimentResult = analyzeSentiment(sentenceWithMention || '');

      mentions.push({
        name: competitor.name,
        position: mentionData.position,
        sentiment: sentimentResult.label,
      });
    }
  }

  return mentions;
}
