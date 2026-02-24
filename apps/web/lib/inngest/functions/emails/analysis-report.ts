import type { z } from "zod";
import type { BrandAnalysisSchema } from "../prompts/brand-analysis";

type BrandAnalysis = z.infer<typeof BrandAnalysisSchema>;

export function buildAnalysisEmail(
  domain: string,
  analysis: BrandAnalysis,
): string {
  const brand = analysis.brand;
  const classification = analysis.classification;
  const competitors = analysis.competitors.slice(0, 5);
  const keywords = analysis.keywords.primary.slice(0, 8);
  const promptCount = Object.values(analysis.prompts).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Visibility Report — ${domain}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1a1a2e;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">OpenSight</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#a0a0b8;">AI Visibility Report</p>
            </td>
          </tr>

          <!-- Brand summary -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#1a1a2e;">${escapeHtml(brand.name)}</h2>
              <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">${escapeHtml(domain)} · ${escapeHtml(classification.industry)} · ${escapeHtml(classification.sub_industry)}</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">${escapeHtml(brand.description)}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>

          <!-- Quick stats -->
          <tr>
            <td style="padding:24px 40px;">
              <h3 style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Quick Stats</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  ${statCell(String(analysis.competitors.length), "Competitors")}
                  ${statCell(String(analysis.products_and_services.length), "Products")}
                  ${statCell(String(promptCount), "Prompts Generated")}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>

          <!-- Value propositions -->
          <tr>
            <td style="padding:24px 40px;">
              <h3 style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Value Propositions</h3>
              ${analysis.value_propositions
                .map(
                  (vp) => `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                  <tr>
                    <td style="width:6px;vertical-align:top;padding-top:6px;">
                      <div style="width:6px;height:6px;border-radius:50%;background-color:#6366f1;"></div>
                    </td>
                    <td style="padding-left:12px;">
                      <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e;">${escapeHtml(vp.statement)}</p>
                      <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${escapeHtml(vp.supporting_evidence)}</p>
                    </td>
                  </tr>
                </table>`,
                )
                .join("")}
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>

          <!-- Top competitors -->
          <tr>
            <td style="padding:24px 40px;">
              <h3 style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Top Competitors</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr style="background-color:#f9fafb;">
                  <td style="padding:8px 12px;font-size:12px;font-weight:600;color:#6b7280;">Name</td>
                  <td style="padding:8px 12px;font-size:12px;font-weight:600;color:#6b7280;">Type</td>
                  <td style="padding:8px 12px;font-size:12px;font-weight:600;color:#6b7280;">Overlap</td>
                </tr>
                ${competitors
                  .map(
                    (c, i) => `
                <tr style="background-color:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
                  <td style="padding:8px 12px;font-size:13px;font-weight:500;color:#1a1a2e;">${escapeHtml(c.name)}</td>
                  <td style="padding:8px 12px;font-size:13px;color:#6b7280;">${escapeHtml(c.relationship)}</td>
                  <td style="padding:8px 12px;font-size:13px;color:#6b7280;">${escapeHtml(c.overlap_area)}</td>
                </tr>`,
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>

          <!-- Keywords -->
          <tr>
            <td style="padding:24px 40px;">
              <h3 style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Primary Keywords</h3>
              <div>
                ${keywords
                  .map(
                    (kw) =>
                      `<span style="display:inline-block;margin:0 6px 8px 0;padding:4px 12px;background-color:#eef2ff;color:#4338ca;font-size:13px;border-radius:20px;">${escapeHtml(kw)}</span>`,
                  )
                  .join("")}
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>

          <!-- Differentiators -->
          <tr>
            <td style="padding:24px 40px;">
              <h3 style="margin:0 0 16px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Key Differentiators</h3>
              ${analysis.differentiators
                .map(
                  (d) =>
                    `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#374151;">→ ${escapeHtml(d)}</p>`,
                )
                .join("")}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://opensight.dev"}/register"
                style="display:inline-block;padding:12px 32px;background-color:#1a1a2e;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                Start tracking your AI visibility
              </a>
              <p style="margin:12px 0 0;font-size:13px;color:#9ca3af;">Sign up free to monitor these ${promptCount} prompts across ChatGPT, Perplexity &amp; Google AI.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                OpenSight · Open-source AI visibility platform<br />
                This report was generated automatically for ${escapeHtml(domain)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function statCell(value: string, label: string): string {
  return `<td width="33%" style="text-align:center;padding:12px 8px;background-color:#f9fafb;border-radius:8px;">
    <div style="font-size:24px;font-weight:700;color:#1a1a2e;">${value}</div>
    <div style="font-size:12px;color:#6b7280;margin-top:4px;">${label}</div>
  </td>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
