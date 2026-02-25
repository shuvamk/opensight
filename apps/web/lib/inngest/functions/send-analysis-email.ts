import { Resend } from "resend";
import { inngest } from "../client";
import { buildAnalysisEmail, type BrandAnalysis } from "./emails/analysis-report";

export const sendAnalysisEmail = inngest.createFunction(
  {
    id: "send-analysis-email",
    name: "Send Analysis Email",
    retries: 3,
  },
  { event: "analysis/completed" },
  async ({ event, step }) => {
    const { domain, email, analysisResult } = event.data;

    await step.run("send-email", async () => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = buildAnalysisEmail(domain, analysisResult as BrandAnalysis);

      const { error } = await resend.emails.send({
        from: "OpenSight <noreply@opensight.dev>",
        to: email,
        subject: `Your AI Visibility Report for ${domain}`,
        html,
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }

      return { email, status: "sent" };
    });

    return { success: true, email, domain };
  },
);
