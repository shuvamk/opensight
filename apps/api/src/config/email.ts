import { Resend } from 'resend';
import { env } from './env.js';

export const resend = new Resend(env.RESEND_API_KEY || '');

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
): Promise<void> {
  await resend.emails.send({
    from: 'noreply@opensight.ai',
    to: email,
    subject: 'Verify your OpenSight account',
    html: `
      <h1>Verify Your Account</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<void> {
  await resend.emails.send({
    from: 'noreply@opensight.ai',
    to: email,
    subject: 'Reset your OpenSight password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  });
}

export async function sendAlertDigest(
  email: string,
  alerts: any[]
): Promise<void> {
  const alertsList = alerts
    .map((alert) => `<li>${alert.title}: ${alert.description}</li>`)
    .join('');

  await resend.emails.send({
    from: 'noreply@opensight.ai',
    to: email,
    subject: 'Your OpenSight Alert Digest',
    html: `
      <h1>Your Alert Digest</h1>
      <ul>${alertsList}</ul>
    `,
  });
}
