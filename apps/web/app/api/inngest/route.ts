import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { handleAnalyseRequest } from "@/lib/inngest/functions/analyse-request";
import { sendAnalysisEmail } from "@/lib/inngest/functions/send-analysis-email";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleAnalyseRequest, sendAnalysisEmail],
});
