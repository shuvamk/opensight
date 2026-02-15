import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import {
  users,
  brands,
  competitors,
  prompts,
  promptResults,
  visibilitySnapshots,
} from './schema';

dotenv.config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Simple SHA-256-like hash for demo purposes (not cryptographically secure)
function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return '$2b$10$' + Math.abs(hash).toString(16).padStart(32, '0');
}

async function seed() {
  const client = postgres(connectionString as string);
  const db = drizzle(client);

  try {
    console.log('Starting seed process...');

    // Create a test user
    const userId = uuidv4();
    const passwordHash = simpleHash('Test1234');

    console.log('Creating test user...');
    await db.insert(users).values({
      id: userId,
      email: 'test@opensight.dev',
      passwordHash,
      fullName: 'Test User',
      emailVerified: true,
      planId: 'pro',
    });

    // Create a brand
    const brandId = uuidv4();
    console.log('Creating test brand...');
    await db.insert(brands).values({
      id: brandId,
      userId,
      name: 'TechCorp Inc',
      websiteUrl: 'https://techcorp.example.com',
      industry: 'Technology',
      isActive: true,
    });

    // Create competitors
    console.log('Creating competitors...');

    await db.insert(competitors).values([
      {
        brandId,
        name: 'CompetitorOne',
        websiteUrl: 'https://competitorone.example.com',
      },
      {
        brandId,
        name: 'CompetitorTwo',
        websiteUrl: 'https://competitortwo.example.com',
      },
    ]);

    // Create prompts
    console.log('Creating test prompts...');
    const promptIds: string[] = [];
    const promptTexts = [
      'What are the best solutions for enterprise data management?',
      'Which companies lead in cloud infrastructure?',
      'What are the top recommendations for API development?',
      'Who are the industry leaders in artificial intelligence?',
      'What solutions are available for cybersecurity?',
    ];

    for (const text of promptTexts) {
      const promptId = uuidv4();
      promptIds.push(promptId);
      await db.insert(prompts).values({
        id: promptId,
        brandId,
        text,
        tags: ['industry', 'competitive-analysis'],
        isActive: true,
      });
    }

    // Create prompt results
    console.log('Creating prompt results...');
    for (let i = 0; i < promptIds.length; i++) {
      const promptId: string = promptIds[i] as string;
      const engines = ['chatgpt', 'perplexity', 'google_aio'];
      
      for (const engine of engines) {
        const isMentioned = Math.random() > 0.4;
        const mentionPos = isMentioned ? Math.floor(Math.random() * 5) + 1 : null;
        const sentScore = (Math.random() * 2 - 1).toFixed(2);
        const sentLabel =
          Math.random() > 0.66 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative';

        await db.insert(promptResults).values({
          promptId,
          brandId,
          engine,
          runDate: new Date().toISOString().split('T')[0],
          responseText: `Sample response for ${engine} on prompt ${i + 1}. This is a simulated response.`,
          brandMentioned: isMentioned,
          mentionPosition: mentionPos,
          sentimentScore: sentScore,
          sentimentLabel: sentLabel,
          citationUrls: ['https://example.com/source1', 'https://example.com/source2'],
          competitorMentions: JSON.stringify([
            { name: 'CompetitorOne', position: 2 },
            { name: 'CompetitorTwo', position: 5 },
          ]),
          visibilityScore: Math.floor(Math.random() * 100),
          rawResponse: JSON.stringify({
            original_length: 500,
            processing_time_ms: Math.floor(Math.random() * 5000),
          }),
        });
      }
    }

    // Create visibility snapshot
    console.log('Creating visibility snapshot...');
    await db.insert(visibilitySnapshots).values({
      brandId,
      snapshotDate: new Date().toISOString().split('T')[0],
      overallScore: 72,
      chatgptScore: 75,
      perplexityScore: 70,
      googleAioScore: 71,
      sentimentPositive: '35.50',
      sentimentNeutral: '45.25',
      sentimentNegative: '19.25',
      totalMentions: 42,
      totalPromptsChecked: 5,
      competitorData: JSON.stringify({
        competitors: ['CompetitorOne', 'CompetitorTwo'],
        mentions_by_competitor: {
          CompetitorOne: 15,
          CompetitorTwo: 12,
        },
      }),
    });

    console.log('Seed process completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: test@opensight.dev');
    console.log('Password: Test1234 (hash: ' + passwordHash + ')');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
