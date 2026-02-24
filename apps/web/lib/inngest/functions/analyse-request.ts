import OpenAI from "openai";
import { z } from "zod";
import { inngest } from "../client";
import {
  BRAND_ANALYSIS_PROMPT,
  BrandAnalysisSchema,
} from "./prompts/brand-analysis";
import { db, analysisRequests, eq } from "@opensight/db";

export const handleAnalyseRequest = inngest.createFunction(
  {
    id: "handle-analyse-request",
    name: "Handle Analyse Request",
    retries: 1,
  },
  { event: "analyse-request" },
  async ({ event, step }) => {
    const { domain, email, requestId } = event.data;

    // Mark as processing
    await step.run("mark-processing", async () => {
      await db
        .update(analysisRequests)
        .set({ status: "processing" })
        .where(eq(analysisRequests.id, requestId));
    });

    const analysisResult = await step.run("analyse-domain", async () => {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const jsonSchema = z.toJSONSchema(BrandAnalysisSchema, {
        target: "draft-2020-12",
      });

      const response = await openai.responses.create({
        model: "gpt-4.1",
        tools: [{ type: "web_search_preview" }],
        input: BRAND_ANALYSIS_PROMPT + domain,
        max_output_tokens: 16000,
        text: {
          format: {
            type: "json_schema",
            name: "brand_analysis",
            strict: true,
            schema: jsonSchema,
          },
        },
      });

      const messageOutput = response.output.find(
        (item: { type: string }) => item.type === "message",
      );

      if (!messageOutput || messageOutput.type !== "message") {
        throw new Error("No message output received from OpenAI");
      }

      for (const item of messageOutput.content) {
        if (item.type === "refusal") {
          throw new Error(`OpenAI refused the request: ${(item as { refusal: string }).refusal}`);
        }
        if (item.type === "output_text") {
          return BrandAnalysisSchema.parse(JSON.parse(item.text));
        }
      }

      throw new Error("No parsed output found in OpenAI response");
    });

    // Save result to DB
    await step.run("save-result", async () => {
      await db
        .update(analysisRequests)
        .set({
          status: "completed",
          result: analysisResult,
          completedAt: new Date(),
        })
        .where(eq(analysisRequests.id, requestId));
    });

    // Trigger email sending as a separate workflow
    await step.sendEvent("trigger-email", {
      name: "analysis/completed",
      data: {
        domain,
        email,
        requestId,
        analysisResult: analysisResult as Record<string, unknown>,
      },
    });

    return { success: true, domain, email, requestId };
  },
);
