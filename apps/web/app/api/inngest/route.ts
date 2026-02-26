import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateReport } from "@/lib/inngest/functions/generate-report";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateReport],
});
