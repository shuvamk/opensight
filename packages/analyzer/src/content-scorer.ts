import * as cheerio from 'cheerio';
import * as readability from 'text-readability';

export interface ContentScoreResult {
  overallScore: number;
  structureScore: number;
  readabilityScore: number;
  freshnessScore: number;
  keyContentScore: number;
  citationScore: number;
  recommendations: string[];
}

/**
 * Scores content based on multiple dimensions: structure, readability, freshness, key content, and citations.
 * Returns detailed scores and recommendations.
 * 
 * @param html - The HTML content to analyze
 * @param url - The URL of the content (optional, for context)
 * @returns ContentScoreResult with scores and recommendations
 */
export async function scoreContent(
  html: string,
  url: string = ''
): Promise<ContentScoreResult> {
  const recommendations: string[] = [];
  const $ = cheerio.load(html);

  // === STRUCTURE SCORING ===
  let structureScore = 0;
  const h1Count = $('h1').length;
  const h2Count = $('h2').length;
  const h3Count = $('h3').length;
  const h4Count = $('h4').length;
  const h5Count = $('h5').length;
  const h6Count = $('h6').length;
  const listCount = $('ul, ol').length;
  const schemaScripts = $('script[type="application/ld+json"]').length;

  // Check for proper heading structure
  if (h1Count === 1) {
    structureScore += 20;
  } else if (h1Count > 1) {
    structureScore += 10;
    recommendations.push('Consider having only one H1 tag per page for better SEO');
  } else {
    recommendations.push('Add an H1 tag to your page for better structure');
  }

  // Check for subheadings
  const totalSubheadings = h2Count + h3Count + h4Count + h5Count + h6Count;
  if (totalSubheadings >= 3) {
    structureScore += 25;
  } else if (totalSubheadings > 0) {
    structureScore += 15;
    recommendations.push('Add more subheadings (H2-H6) to improve content structure');
  } else {
    recommendations.push('Add subheadings to organize your content better');
  }

  // Check for lists
  if (listCount >= 2) {
    structureScore += 20;
  } else if (listCount === 1) {
    structureScore += 10;
    recommendations.push('Consider using more lists to organize information');
  } else {
    recommendations.push('Use lists (ul/ol) to improve content organization');
  }

  // Check for schema/JSON-LD
  if (schemaScripts > 0) {
    structureScore += 20;
  } else {
    recommendations.push('Add structured data (schema.org/JSON-LD) to enhance content discoverability');
  }

  // Check for other semantic elements
  const semanticElements = $('article, section, aside, nav').length;
  if (semanticElements > 0) {
    structureScore += 15;
  }

  // === READABILITY SCORING ===
  let readabilityScore = 0;
  let textContent = $('body').text();
  
  if (!textContent || textContent.trim().length === 0) {
    textContent = $.text();
  }

  if (textContent && textContent.trim().length > 0) {
    try {
      const fleschScore = readability.flesch(textContent);
      
      // Convert Flesch score (0-100) to our score (0-100)
      // Flesch-Kincaid: 90-100 = very easy, 60-70 = standard, 0-30 = very difficult
      readabilityScore = Math.max(0, Math.min(100, fleschScore));
      
      if (fleschScore < 60) {
        recommendations.push('Improve readability by using shorter sentences and simpler words');
      }
    } catch (error) {
      // If readability calculation fails, use text length as proxy
      const wordCount = textContent.split(/\s+/).length;
      readabilityScore = Math.min(100, Math.max(0, (wordCount / 500) * 100));
      
      if (wordCount < 300) {
        recommendations.push('Add more substantive content to your page (minimum 300 words recommended)');
      }
    }
  } else {
    recommendations.push('Add more text content to your page');
  }

  // === FRESHNESS SCORING ===
  let freshnessScore = 50; // Default neutral score
  const lastModified = $('meta[http-equiv="last-modified"]').attr('content') ||
                       $('meta[name="last-modified"]').attr('content');
  const articleModified = $('meta[property="article:modified_time"]').attr('content');
  const publishedTime = $('meta[property="article:published_time"]').attr('content');

  if (lastModified || articleModified || publishedTime) {
    const dateStr = lastModified || articleModified || publishedTime || '';
    try {
      const modifiedDate = new Date(dateStr);
      const now = new Date();
      const daysOld = (now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld < 30) {
        freshnessScore = 100;
      } else if (daysOld < 90) {
        freshnessScore = 75;
      } else if (daysOld < 180) {
        freshnessScore = 50;
      } else if (daysOld < 365) {
        freshnessScore = 25;
      } else {
        freshnessScore = 10;
        recommendations.push('Update your content to reflect current information');
      }
    } catch (error) {
      // Invalid date format
    }
  } else {
    recommendations.push('Add publication or modification dates to your content');
  }

  // === KEY CONTENT SCORING ===
  let keyContentScore = 0;

  // Check for key elements
  const paragraphCount = $('p').length;
  const imageCount = $('img').length;
  const videoCount = $('iframe[src*="youtube"], iframe[src*="vimeo"], video').length;
  const linkCount = $('a').length;

  if (paragraphCount >= 5) {
    keyContentScore += 25;
  } else if (paragraphCount >= 3) {
    keyContentScore += 15;
  } else {
    recommendations.push('Add more paragraphs of substantive content');
  }

  if (imageCount >= 2) {
    keyContentScore += 25;
  } else if (imageCount === 1) {
    keyContentScore += 15;
  } else {
    recommendations.push('Add relevant images to your content');
  }

  if (videoCount > 0) {
    keyContentScore += 20;
  }

  if (linkCount >= 3) {
    keyContentScore += 15;
  } else {
    recommendations.push('Include more internal and external links for context and SEO');
  }

  // Check for meta descriptions and titles
  const metaDescription = $('meta[name="description"]').attr('content');
  const pageTitle = $('title').text() || $('meta[property="og:title"]').attr('content');

  if (metaDescription && metaDescription.length > 50 && metaDescription.length < 160) {
    keyContentScore += 10;
  } else {
    recommendations.push('Optimize your meta description (50-160 characters)');
  }

  if (pageTitle && pageTitle.length > 0) {
    keyContentScore += 5;
  }

  // === CITATION SCORING ===
  let citationScore = 0;

  // Look for statistics, quotes, and data indicators
  const blockquoteCount = $('blockquote').length;
  const dataAttributes = $('[data-*]').length;
  
  // Check for citation-like patterns in text
  const citationPatterns = /cited|source|according to|research shows|studies indicate|data shows/gi;
  const citationMatches = textContent.match(citationPatterns) || [];

  if (blockquoteCount > 0) {
    citationScore += 30;
  } else {
    recommendations.push('Include quotes or blockquotes to support your claims');
  }

  if (dataAttributes > 0) {
    citationScore += 20;
  }

  if (citationMatches.length > 0) {
    citationScore += 30;
  } else {
    recommendations.push('Reference sources and cite data to increase credibility');
  }

  if (linkCount > 0) {
    citationScore += 20;
  }

  // === CALCULATE OVERALL SCORE ===
  const weights = {
    structure: 0.2,
    readability: 0.25,
    freshness: 0.15,
    keyContent: 0.25,
    citation: 0.15,
  };

  const overallScore = Math.round(
    structureScore * weights.structure +
    readabilityScore * weights.readability +
    freshnessScore * weights.freshness +
    keyContentScore * weights.keyContent +
    citationScore * weights.citation
  );

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    structureScore: Math.min(100, structureScore),
    readabilityScore: Math.min(100, Math.max(0, readabilityScore)),
    freshnessScore,
    keyContentScore: Math.min(100, keyContentScore),
    citationScore: Math.min(100, citationScore),
    recommendations,
  };
}
