"use server";

import { db, reports, eq } from "@opensight/db";
import { inngest } from "@/lib/inngest/client";
import { nanoid } from "nanoid";

export async function submitGetStarted(formData: {
  email: string;
  domain: string;
}): Promise<
  | { success: true; reportSlug: string }
  | { success: false; reason: "limit_reached" }
> {
  const { email, domain } = formData;

  // Normalize domain (strip protocol/trailing slash)
  const normalizedDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

  // Check if this email already has a report
  const existing = await db
    .select({ id: reports.id })
    .from(reports)
    .where(eq(reports.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { success: false, reason: "limit_reached" };
  }

  const slug = nanoid(12);

  // Create report entry
  const [report] = await db
    .insert(reports)
    .values({
      slug,
      email,
      domain: normalizedDomain,
      title: `AI Visibility Report — ${normalizedDomain}`,
      reportType: "analysis",
      status: "pending",
    })
    .returning({ id: reports.id });

  // Trigger the 3-node Inngest workflow
  await inngest.send({
    name: "report/request",
    data: {
      reportId: report.id,
      domain: normalizedDomain,
      email,
    },
  });

  return { success: true, reportSlug: slug };
}
