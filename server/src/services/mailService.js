/**
 * mailService.js
 * Sends transactional emails via the Brevo (formerly Sendinblue) API.
 *
 * Required environment variables (optional – email is silently skipped when absent):
 *   BREVO_API_KEY        – your Brevo v3 API key
 *   BREVO_SENDER_EMAIL   – verified sender address  (e.g. noreply@yourdomain.com)
 *   BREVO_SENDER_NAME    – display name             (defaults to "Shradha Admin")
 */

/**
 * Sends a password-reset email to an admin user.
 *
 * @param {{ admin: { name: string, email: string }, resetLink: string, expiresInMinutes: number }} opts
 * @returns {Promise<boolean>} true if the email was dispatched, false otherwise
 */
async function sendAdminPasswordResetEmail({ admin, resetLink, expiresInMinutes }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  // Gracefully skip sending when Brevo credentials are not configured.
  if (!apiKey || !senderEmail) {
    return false;
  }

  const senderName = process.env.BREVO_SENDER_NAME || 'Shradha Admin';

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: admin.email, name: admin.name }],
    subject: 'Reset your Shradha admin password',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${escapeHtml(admin.name)},</p>
        <p>We received a request to reset the password for your Shradha admin account.</p>
        <p style="margin: 24px 0;">
          <a href="${escapeHtml(resetLink)}"
             style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
            Reset Password
          </a>
        </p>
        <p>This link expires in <strong>${expiresInMinutes} minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <hr style="margin-top:32px;border:none;border-top:1px solid #e5e7eb;" />
        <p style="font-size:12px;color:#6b7280;">
          If the button above doesn't work, copy and paste this URL into your browser:<br />
          <a href="${escapeHtml(resetLink)}">${escapeHtml(resetLink)}</a>
        </p>
      </div>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[mailService] Brevo API error ${response.status}: ${errorBody}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[mailService] Failed to send email:', err.message);
    return false;
  }
}

/** Minimal HTML escaping to prevent XSS in email bodies. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendAdminPasswordResetEmail };
