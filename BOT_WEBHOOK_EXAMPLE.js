// Example webhook handler for pokestash_bot
// Production note: deploy behind HTTPS, keep process warm

const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Bot token via env
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const API = (method) => `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;

// Handle webhook updates
app.post('/webhook', async (req, res) => {
  // ACK ASAP to avoid BOT_PRECHECKOUT_TIMEOUT
  res.status(200).end();

  const update = req.body;

  try {
    // 1) Pre-checkout must be answered within 10s
    if (update.pre_checkout_query) {
      await handlePreCheckoutQuery(update.pre_checkout_query);
      return;
    }

    // 2) Successful payment → fulfill order
    if (update.message?.successful_payment) {
      await handleSuccessfulPayment(update.message);
      return;
    }
  } catch (error) {
    console.error('Webhook handling error:', error);
  }
});

// Handle pre-checkout query
async function handlePreCheckoutQuery(query) {
  try {
    const payload = safeParse(query.invoice_payload);
    const isGacha = payload?.type === 'gacha_draw';

    // Approve quickly (add your own stock/capacity checks if needed)
    await fetch(API('answerPreCheckoutQuery'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: query.id,
        ok: !!isGacha,
        error_message: isGacha ? undefined : 'Invalid order type'
      })
    });
  } catch (e) {
    console.error('answerPreCheckoutQuery failed:', e);
  }
}

// Handle successful payment
async function handleSuccessfulPayment(message) {
  const payment = message.successful_payment;
  const payload = safeParse(payment.invoice_payload);
  if (payload?.type !== 'gacha_draw') return;

  const { gachaType, starsAmount } = payload;
  const userId = message.from?.id || payload.userId;

  // Perform draw (replace mock with your DB call)
  const drawnCard = await processGachaDraw(userId, gachaType);

  // Notify user
  await sendMessage(userId, `🎉 You drew: ${drawnCard.name} (${drawnCard.rarity})!`);

  // Persist
  await storePaymentRecord({
    userId,
    gachaType,
    starsAmount,
    cardId: drawnCard.id,
    paymentId: payment.telegram_payment_charge_id
  });
}

// Helper function to send message
async function sendMessage(chatId, text) {
  await fetch(API('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text
    })
  });
}

// Your existing gacha draw function
async function processGachaDraw(userId, gachaType) {
  // This should call your existing database function
  // Example: return await supabase.rpc("draw_from_gacha", { ... });
  
  // Mock implementation
  return {
    id: 'card_123',
    name: 'Pikachu',
    rarity: 'rare',
    value: 25
  };
}

// Store payment record
async function storePaymentRecord(record) {
  // Store in your database
  // Example: await supabase.from('payments').insert(record);
  console.log('Payment record:', record);
}

function safeParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot webhook server running on port ${PORT}`);
});
