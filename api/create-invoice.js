// Vercel serverless function to create Telegram Stars invoices
// Exposes POST /api/create-invoice

/**
 * Expected Vercel env var:
 * TELEGRAM_BOT_TOKEN=8217454823:AAFlU_NsX3f2DwMQSBDdRMz04Zh6hU2pK_c
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const API = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const {
      title,
      description,
      payload,
      provider_token,
      currency,
      prices
    } = req.body;

    console.log('[create-invoice] Creating invoice:', { title, currency, prices });

    const response = await fetch(API('createInvoiceLink'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        payload,
        provider_token,
        currency,
        prices
      })
    });

    const data = await response.json();
    
    console.log('[create-invoice] Response:', { status: response.status, ok: data.ok });

    if (!response.ok) {
      console.error('[create-invoice] Error:', data);
      res.status(response.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('[create-invoice] Exception:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Internal Server Error',
      description: error.message 
    });
  }
}
