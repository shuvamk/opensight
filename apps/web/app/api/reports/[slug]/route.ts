import { NextRequest, NextResponse } from "next/server";
import { db, reports, eq } from "@opensight/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const report = await db.query.reports.findFirst({
    where: eq(reports.slug, slug),
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.status !== "completed") {
    return NextResponse.json(
      {
        id: report.id,
        slug: report.slug,
        status: report.status,
        title: report.title,
        domain: report.domain,
      },
      { status: 202 },
    );
  }

  // Check expiration
  if (report.expiresAt && new Date(report.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Report has expired" }, { status: 410 });
  }

  return NextResponse.json({
    id: report.id,
    slug: report.slug,
    title: report.title,
    domain: report.domain,
    reportType: report.reportType,
    status: report.status,
    data: report.data,
    summary: report.summary,
    createdAt: report.createdAt,
    completedAt: report.completedAt,
  });
}
