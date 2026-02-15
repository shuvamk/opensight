import { db, apiKeys, users } from '@opensight/db';
import { eq, and, isNull } from 'drizzle-orm';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

interface CreateApiKeyInput {
  name: string;
}

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

function generateApiKey(): string {
  // Generate a readable API key: sk_test_XXXXXX...
  const prefix = 'sk_';
  const randomBytes = crypto.randomBytes(32).toString('hex');
  return prefix + randomBytes;
}

export class ApiKeyService {
  async listApiKeys(userId: string) {
    try {
      const keys = await db
        .select({
          id: apiKeys.id,
          name: apiKeys.name,
          keyPrefix: apiKeys.keyPrefix,
          lastUsedAt: apiKeys.lastUsedAt,
          createdAt: apiKeys.createdAt,
          revokedAt: apiKeys.revokedAt,
        })
        .from(apiKeys)
        .where(eq(apiKeys.userId, userId));

      return keys;
    } catch (error) {
      logger.error(error, 'Error listing API keys');
      throw error;
    }
  }

  async createApiKey(userId: string, input: CreateApiKeyInput) {
    try {
      // Generate the full API key
      const fullKey = generateApiKey();
      const keyPrefix = fullKey.substring(0, 20);
      const keyHash = hashApiKey(fullKey);

      const result = await db
        .insert(apiKeys)
        .values({
          userId,
          name: input.name,
          keyPrefix,
          keyHash,
        })
        .returning({
          id: apiKeys.id,
          name: apiKeys.name,
          keyPrefix: apiKeys.keyPrefix,
          createdAt: apiKeys.createdAt,
        });

      if (!result[0]) {
        throw new Error('Failed to create API key');
      }

      // Return the full key only once
      return {
        ...result[0],
        key: fullKey, // This is the only time the full key is returned
      };
    } catch (error) {
      logger.error(error, 'Error creating API key');
      throw error;
    }
  }

  async revokeApiKey(keyId: string, userId: string) {
    try {
      const key = await db
        .select()
        .from(apiKeys)
        .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
        .limit(1);

      if (!key[0]) {
        throw new Error('API key not found');
      }

      if (key[0].revokedAt) {
        throw new Error('API key is already revoked');
      }

      const result = await db
        .update(apiKeys)
        .set({ revokedAt: new Date() })
        .where(eq(apiKeys.id, keyId))
        .returning({
          id: apiKeys.id,
          name: apiKeys.name,
          keyPrefix: apiKeys.keyPrefix,
          revokedAt: apiKeys.revokedAt,
        });

      if (!result[0]) {
        throw new Error('Failed to revoke API key');
      }

      return result[0];
    } catch (error) {
      logger.error(error, 'Error revoking API key');
      throw error;
    }
  }

  async validateApiKey(fullKey: string): Promise<{ userId: string; email: string } | null> {
    try {
      const keyHash = hashApiKey(fullKey);

      const key = await db
        .select({
          userId: apiKeys.userId,
          email: users.email,
          revokedAt: apiKeys.revokedAt,
        })
        .from(apiKeys)
        .innerJoin(users, eq(apiKeys.userId, users.id))
        .where(and(eq(apiKeys.keyHash, keyHash), isNull(apiKeys.revokedAt)))
        .limit(1);

      if (!key[0]) {
        return null;
      }

      // Update last used timestamp
      await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.keyHash, keyHash));

      const keyData = key[0];
      return {
        userId: keyData.userId,
        email: keyData.email,
      };
    } catch (error) {
      logger.error(error, 'Error validating API key');
      return null;
    }
  }

  async getApiKeyCount(userId: string) {
    try {
      const keys = await db
        .select()
        .from(apiKeys)
        .where(and(eq(apiKeys.userId, userId), isNull(apiKeys.revokedAt)));

      return keys.length;
    } catch (error) {
      logger.error(error, 'Error getting API key count');
      throw error;
    }
  }
}

export const apiKeyService = new ApiKeyService();
