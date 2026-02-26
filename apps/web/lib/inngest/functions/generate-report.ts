import OpenAI from "openai";
import { z } from "zod";
import { Resend } from "resend";
import { inngest } from "../client";
import {
  BRAND_ANALYSIS_PROMPT,
  BrandAnalysisSchema,
} from "./prompts/brand-analysis";
import { db, reports, trackingPrompts, eq } from "@opensight/db";
import { buildReportEmail } from "./emails/report-email";

export const generateReport = inngest.createFunction(
  {
    id: "generate-report",
    name: "Generate Report",
    retries: 1,
  },
  { event: "report/request" },
  async ({ event, step }) => {
    const { reportId, domain, email } = event.data;

    // ================================================================
    // NODE 1: Fetch analysis data from OpenAI
    // ================================================================
    const analysisResult = await step.run("fetch-analysis", async () => {
      await db
        .update(reports)
        .set({ status: "processing" })
        .where(eq(reports.id, reportId));

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
        (item) => item.type === "message",
      );

      if (!messageOutput || messageOutput.type !== "message") {
        throw new Error("No message output received from OpenAI");
      }

      for (const item of messageOutput.content) {
        if (item.type === "refusal") {
          throw new Error(
            `OpenAI refused the request: ${item.refusal}`,
          );
        }
        if (item.type === "output_text") {
          return BrandAnalysisSchema.parse(JSON.parse(item.text));
        }
      }

      throw new Error("No parsed output found in OpenAI response");
    });

    // ================================================================
    // NODE 2: Generate & save report to DB
    // ================================================================
    const savedReport = await step.run("generate-report", async () => {
      const brand = analysisResult.brand;
      const classification = analysisResult.classification;
      const promptCount = Object.values(analysisResult.prompts).reduce(
        (sum, arr) => sum + arr.length,
        0,
      );

      const title = `AI Visibility Report — ${brand.name}`;
      const summary = `${brand.name} (${domain}) is a ${classification.company_size_estimate.replace(/_/g, " ")} ${classification.business_model.replace(/_/g, " ")} company in ${classification.industry} / ${classification.sub_industry}. Found ${analysisResult.competitors.length} competitors, ${analysisResult.products_and_services.length} products, and generated ${promptCount} tracking prompts.`;

      await db
        .update(reports)
        .set({
          title,
          status: "completed",
          data: analysisResult as unknown as Record<string, unknown>,
          summary,
          completedAt: new Date(),
        })
        .where(eq(reports.id, reportId));

      // Fetch slug for the report link
      const report = await db.query.reports.findFirst({
        where: eq(reports.id, reportId),
        columns: { slug: true },
      });

      return { slug: report!.slug as string, title, brandName: brand.name };
    });

    // ================================================================
    // NODE 3: Save tracking prompts to dedicated table
    // ================================================================
    await step.run("save-tracking-prompts", async () => {
      const p = analysisResult.prompts;

      await db.insert(trackingPrompts).values({
        reportId,
        domain,
        discovery: p.discovery,
        comparison: p.comparison,
        recommendation: p.recommendation,
        buyingDecision: p.buying_decision,
        problemSolution: p.problem_solution,
        reviewSentiment: p.review_sentiment,
        featureDeepDive: p.feature_deep_dive,
        useCaseSpecific: p.use_case_specific,
        industryLandscape: p.industry_landscape,
        reputationRisks: p.negative_reputation,
      });
    });

    // ================================================================
    // NODE 4: Send email with report link
    // ================================================================
    await step.run("send-email", async () => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://opensight.dev";
      const reportUrl = `${appUrl}/report/${savedReport.slug}`;

      const html = buildReportEmail({
        brandName: savedReport.brandName,
        reportTitle: savedReport.title,
        reportUrl,
      });

      const { error } = await resend.emails.send({
        from: "OpenSight <donotreply@opensight.dev>",
        to: email,
        subject: `Your AI Visibility Report for ${savedReport.brandName} is ready`,
        html,
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return { email, status: "sent" };
    });

    return {
      success: true,
      reportId,
      slug: savedReport.slug,
      brandName: savedReport.brandName,
    };
  },
);
