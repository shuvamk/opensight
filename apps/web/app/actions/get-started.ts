"use server";

import { db, analysisRequests } from "@opensight/db";
import { inngest } from "@/lib/inngest/client";

export async function submitGetStarted(formData: {
  email: string;
  domain: string;
}) {
  const { email, domain } = formData;

  // Normalize domain (strip protocol/trailing slash)
  const normalizedDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  // Insert into DB
  const [request] = await db
    .insert(analysisRequests)
    .values({
      email,
      domain: normalizedDomain,
    })
    .returning({ id: analysisRequests.id });

  // Trigger Inngest analysis
  await inngest.send({
    name: "analyse-request",
    data: {
      email,
      domain: normalizedDomain,
      requestId: request.id,
    },
  });

  return { success: true, requestId: request.id };
}
