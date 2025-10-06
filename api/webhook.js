// Vercel serverless Telegram webhook for @pigeonhole2049_bot
// Exposes POST /api/webhook

/**
 * Expected Vercel env var:
 * TELEGRAM_BOT_TOKEN=8061583959:AAFCVsFXKKWAyrLCVHZbzPsY_sGQ1gj7v6w
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || '';
const API = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  // Don't end response yet; we will answer pre_checkout first, then end

  try {
    const update = req.body || {};
    // Debug logs to verify runtime
    try {
      console.log('[webhook] TOKEN set:', !!BOT_TOKEN,
        'keys:', Object.keys(update || {}),
        'has pre_checkout_query:', !!update.pre_checkout_query,
        'has successful_payment:', !!(update.message && update.message.successful_payment));
    } catch {}

    // Pre-checkout must be answered within 10s
    if (update.pre_checkout_query) {
      await answerPreCheckout(update.pre_checkout_query);
      // End after answering precheckout to avoid serverless freezing before fetch completes
      res.status(200).end();
      return;
    }

    // Successful payment → fulfill (async), then end
    if (update.message && update.message.successful_payment) {
      handleSuccessfulPayment(update.message).catch((e) => console.error('fulfillment error', e));
      res.status(200).end();
      return;
    }

    // Default OK for other updates
    res.status(200).end();
  } catch (e) {
    console.error('Webhook error:', e);
    try { res.status(200).end(); } catch {}
  }
}

async function answerPreCheckout(preCheckoutQuery) {
  try {
    const payload = safeParse(preCheckoutQuery.invoice_payload);
    const isGacha = payload?.type === 'gacha_draw';

    console.log('[precheckout] answering ok:', !!isGacha, 'id:', preCheckoutQuery.id);

    const resp = await fetch(API('answerPreCheckoutQuery'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: preCheckoutQuery.id,
        ok: !!isGacha
      })
    });

    let bodyText = '';
    try { bodyText = await resp.text(); } catch {}
    console.log('[precheckout] status:', resp.status, 'body:', bodyText);
  } catch (e) {
    console.error('answerPreCheckoutQuery failed:', e);
  }
}

async function handleSuccessfulPayment(message) {
  const payment = message.successful_payment;
  const payload = safeParse(payment.invoice_payload);
  if (payload?.type !== 'gacha_draw') return;

  const userId = message.from?.id || payload.userId;
  const gachaType = payload.gachaType;
  const starsAmount = payload.starsAmount;

  // TODO: integrate with your DB: perform draw_from_gacha and persist
  const drawnCard = await mockDraw(gachaType);

  await sendMessage(userId, `🎉 You drew a card! Check your inventory to see it.`);

  // Persist record (replace with DB insert)
  console.log('Payment record', {
    userId,
    gachaType,
    starsAmount,
    cardId: drawnCard.id,
    paymentId: payment.telegram_payment_charge_id,
  });
}

async function sendMessage(chatId, text) {
  if (!BOT_TOKEN) {
    console.warn('Missing TELEGRAM_BOT_TOKEN; cannot send message');
    return;
  }
  await fetch(API('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

function safeParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}


