import { db, prompts, promptResults, brands } from '@opensight/db';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

interface CreatePromptInput {
  text: string;
  tags?: string[];
}

interface UpdatePromptInput {
  text?: string;
  tags?: string[];
  isActive?: boolean;
}

export class PromptService {
  async listPrompts(
    brandId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
    tags?: string[]
  ) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const offset = (page - 1) * limit;

      // Build query
      const allPrompts = await db
        .select()
        .from(prompts)
        .where(eq(prompts.brandId, brandId));

      // If tags are provided, filter by tags (simple string matching)
      let filteredPrompts = allPrompts;
      if (tags && tags.length > 0) {
        filteredPrompts = allPrompts.filter((prompt) => {
          const promptTags = prompt.tags || [];
          return tags.some((tag) => promptTags.includes(tag));
        });
      }

      const total = filteredPrompts.length;

      // Get paginated results
      const results = filteredPrompts
        .sort((a, b) => new Date(b.createdAt ?? new Date()).getTime() - new Date(a.createdAt ?? new Date()).getTime())
        .slice(offset, offset + limit);

      // For each prompt, get the latest result
      const promptsWithLatest = await Promise.all(
        results.map(async (prompt) => {
          const latestResult = await db
            .select()
            .from(promptResults)
            .where(eq(promptResults.promptId, prompt.id))
            .orderBy(desc(promptResults.createdAt))
            .limit(1);

          return {
            ...prompt,
            latestResult: latestResult[0] || null,
          };
        })
      );

      return {
        prompts: promptsWithLatest,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(error, 'Error listing prompts');
      throw error;
    }
  }

  async createPrompt(brandId: string, userId: string, input: CreatePromptInput) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Check for duplicate prompt text
      const existing = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.brandId, brandId), eq(prompts.text, input.text)))
        .limit(1);

      if (existing.length) {
        throw new Error('This prompt text already exists for this brand');
      }

      const result = await db
        .insert(prompts)
        .values({
          brandId,
          text: input.text,
          tags: input.tags || [],
          isActive: true,
        })
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error creating prompt');
      throw error;
    }
  }

  async createBulkPrompts(brandId: string, userId: string, promptInputs: CreatePromptInput[]) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      // Get existing prompt texts for this brand
      const existing = await db
        .select({ text: prompts.text })
        .from(prompts)
        .where(eq(prompts.brandId, brandId));

      const existingTexts = new Set(existing.map((p) => p.text));

      // Filter out duplicates
      const newPrompts = promptInputs.filter((p) => !existingTexts.has(p.text));

      if (newPrompts.length === 0) {
        throw new Error('All prompts already exist for this brand');
      }

      const results = await db
        .insert(prompts)
        .values(
          newPrompts.map((p) => ({
            brandId,
            text: p.text,
            tags: p.tags || [],
            isActive: true,
          }))
        )
        .returning();

      return {
        created: results.length,
        skipped: promptInputs.length - results.length,
        prompts: results,
      };
    } catch (error) {
      logger.error(error, 'Error creating bulk prompts');
      throw error;
    }
  }

  async getPrompt(brandId: string, promptId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const prompt = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId)))
        .limit(1);

      if (!prompt[0]) {
        throw new Error('Prompt not found');
      }

      // Get latest result
      const latestResult = await db
        .select()
        .from(promptResults)
        .where(eq(promptResults.promptId, promptId))
        .orderBy(desc(promptResults.createdAt))
        .limit(1);

      return {
        ...prompt[0],
        latestResult: latestResult[0] || null,
      };
    } catch (error) {
      logger.error(error, 'Error getting prompt');
      throw error;
    }
  }

  async updatePrompt(
    brandId: string,
    promptId: string,
    userId: string,
    input: UpdatePromptInput
  ) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const prompt = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId)))
        .limit(1);

      if (!prompt.length) {
        throw new Error('Prompt not found');
      }

      // If updating text, check for duplicates
      if (input.text && input.text !== prompt[0]?.text) {
        const existing = await db
          .select()
          .from(prompts)
          .where(and(eq(prompts.brandId, brandId), eq(prompts.text, input.text)))
          .limit(1);

        if (existing.length) {
          throw new Error('This prompt text already exists for this brand');
        }
      }

      const result = await db
        .update(prompts)
        .set({
          text: input.text,
          tags: input.tags,
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(prompts.id, promptId))
        .returning();

      return result[0];
    } catch (error) {
      logger.error(error, 'Error updating prompt');
      throw error;
    }
  }

  async deletePrompt(brandId: string, promptId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const prompt = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId)))
        .limit(1);

      if (!prompt.length) {
        throw new Error('Prompt not found');
      }

      await db.delete(prompts).where(eq(prompts.id, promptId));

      return { success: true };
    } catch (error) {
      logger.error(error, 'Error deleting prompt');
      throw error;
    }
  }

  async getPromptResults(brandId: string, promptId: string, userId: string) {
    try {
      // Verify brand ownership
      const brand = await db
        .select()
        .from(brands)
        .where(and(eq(brands.id, brandId), eq(brands.userId, userId)))
        .limit(1);

      if (!brand.length) {
        throw new Error('Brand not found or you do not have access to it');
      }

      const prompt = await db
        .select()
        .from(prompts)
        .where(and(eq(prompts.id, promptId), eq(prompts.brandId, brandId)))
        .limit(1);

      if (!prompt.length) {
        throw new Error('Prompt not found');
      }

      const results = await db
        .select()
        .from(promptResults)
        .where(eq(promptResults.promptId, promptId))
        .orderBy(desc(promptResults.createdAt));

      return {
        promptId,
        prompt: prompt[0],
        results,
      };
    } catch (error) {
      logger.error(error, 'Error getting prompt results');
      throw error;
    }
  }

  async getPromptCount(brandId: string) {
    try {
      const result = await db
        .select()
        .from(prompts)
        .where(eq(prompts.brandId, brandId));

      return result.length;
    } catch (error) {
      logger.error(error, 'Error getting prompt count');
      throw error;
    }
  }

  async suggestPrompts(industry?: string, count: number = 20) {
    // Hardcoded industry-specific prompts for now
    const suggestions: Record<string, string[]> = {
      SaaS: [
        'What SaaS tools do you recommend for project management?',
        'Which SaaS platforms are best for team collaboration?',
        'What are the top alternatives to Slack?',
        'Best CRM software for small businesses?',
        'Recommend a reliable project management tool',
        'What is the best code collaboration platform?',
        'Which accounting software would you suggest?',
        'Best password management software?',
        'What are popular SEO tools?',
        'Recommend a customer support SaaS platform',
      ],
      'E-commerce': [
        'What are the best e-commerce platforms?',
        'Recommend a shopping cart solution',
        'Best payment processing for online stores?',
        'What inventory management software do you suggest?',
        'Best e-commerce analytics tools?',
        'Recommend a dropshipping platform',
        'What platform would you use for an online store?',
        'Best email marketing for e-commerce?',
        'Recommend an order fulfillment service',
        'What are popular marketplace platforms?',
      ],
      Finance: [
        'What are the best financial planning tools?',
        'Recommend investment platforms',
        'Best accounting software for accountants?',
        'What platforms offer crypto trading?',
        'Best tax software for small business?',
        'Recommend a budgeting app',
        'What are popular trading platforms?',
        'Best robo-advisor services?',
        'Recommend a portfolio tracking tool',
        'What insurance comparison sites exist?',
      ],
      Healthcare: [
        'What are the best patient management systems?',
        'Recommend telehealth platforms',
        'Best medical billing software?',
        'What EHR systems are popular?',
        'Recommend a healthcare scheduling system',
        'Best mental health apps?',
        'What fitness tracking platforms exist?',
        'Best medical imaging software?',
        'Recommend a pharmacy management system',
        'What are popular telemedicine solutions?',
      ],
      Agency: [
        'What project management tools for agencies?',
        'Best time tracking software for agencies?',
        'Recommend a client portal solution',
        'What invoicing software for agencies?',
        'Best resource planning tools?',
        'Recommend a collaboration platform',
        'What portfolio management software exists?',
        'Best workflow automation tools?',
        'Recommend a retainer management tool',
        'What CMS platforms do agencies use?',
      ],
      Other: [
        'What tools would you recommend?',
        'What is the most helpful software in your field?',
        'Which platforms have the best user experience?',
        'What are the most innovative solutions you know?',
        'Recommend your favorite productivity tool',
        'What software do you use most often?',
        'Best free alternatives to expensive tools?',
        'What emerging platforms are you following?',
        'Recommend a must-have app',
        'What technology has impressed you recently?',
      ],
    };

    const defaultPrompts: string[] = [
      'What tools would you recommend?',
      'What is the most helpful software in your field?',
      'Which platforms have the best user experience?',
      'What are the most innovative solutions you know?',
      'Recommend your favorite productivity tool',
      'What software do you use most often?',
      'Best free alternatives to expensive tools?',
      'What emerging platforms are you following?',
      'Recommend a must-have app',
      'What technology has impressed you recently?',
    ];

    const industryPrompts = suggestions[industry ?? 'Other'] ?? defaultPrompts;
    return industryPrompts.slice(0, count).map((text) => ({ text }));
  }
}

export const promptService = new PromptService();
