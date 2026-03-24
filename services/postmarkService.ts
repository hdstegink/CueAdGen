
// Service to handle sending emails via Postmark API

const POSTMARK_API_KEY = process.env.POSTMARK_API_KEY || '';
// NOTE: The 'From' address must be a Verified Sender Signature in Postmark.
// Updated to the verified address provided in the working example.
const SENDER_EMAIL = 'almer@sokkenmakers.nl'; 

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  bcc?: string;
}

export const sendPostmarkEmail = async ({ to, subject, htmlBody, bcc }: EmailPayload): Promise<void> => {
  // We use corsproxy.io to bypass the browser's CORS restriction, 
  // as Postmark's API does not allow direct client-side calls.
  const url = 'https://corsproxy.io/?https://api.postmarkapp.com/email';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_API_KEY
    },
    body: JSON.stringify({
      From: SENDER_EMAIL,
      To: to,
      Bcc: bcc,
      Subject: subject,
      HtmlBody: htmlBody,
      MessageStream: 'broadcast' 
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[Postmark Error]', errorData);
    // Provide more context in the error message
    const message = errorData.Message || `Foutcode: ${errorData.ErrorCode || response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  console.log('[Postmark Success]', data);
};
