
// Service to handle sending emails via server-side proxy

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  bcc?: string;
}

export const sendPostmarkEmail = async ({ to, subject, htmlBody, bcc }: EmailPayload): Promise<void> => {
  const response = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, htmlBody, bcc }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[Postmark Error]', errorData);
    const message = errorData.error || `Foutcode: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  console.log('[Postmark Success]', data);
};
