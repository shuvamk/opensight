interface ReportEmailParams {
  brandName: string;
  reportTitle: string;
  reportUrl: string;
}

export function buildReportEmail({
  brandName,
  reportTitle,
  reportUrl,
}: ReportEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(reportTitle)}</title>
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
              <p style="margin:8px 0 0;font-size:13px;color:#a0a0b8;">Visibility Report</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1a1a2e;">Your report is ready</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">
                We've finished generating the AI visibility report for <strong>${escapeHtml(brandName)}</strong>.
                The report includes your visibility scores across ChatGPT, Perplexity, and Google AI,
                sentiment analysis, competitor mentions, and actionable insights.
              </p>

              <!-- Report title card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Report</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:#1a1a2e;">${escapeHtml(reportTitle)}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${escapeHtml(reportUrl)}"
                      style="display:inline-block;padding:14px 40px;background-color:#6366f1;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      View Full Report
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;">
                Or copy this link: <a href="${escapeHtml(reportUrl)}" style="color:#6366f1;text-decoration:underline;">${escapeHtml(reportUrl)}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                OpenSight · Open-source AI visibility platform<br />
                This report was generated automatically for ${escapeHtml(brandName)}.
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
