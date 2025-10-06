// Example webhook handler for pokestash_bot
// Add this to your bot's webhook endpoint

const express = require('express');
const app = express();

app.use(express.json());

// Your bot token
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Handle webhook updates
app.post('/webhook', async (req, res) => {
  const update = req.body;
  
  try {
    // Handle pre-checkout query
    if (update.pre_checkout_query) {
      await handlePreCheckoutQuery(update.pre_checkout_query);
    }
    
    // Handle successful payment
    if (update.message?.successful_payment) {
      await handleSuccessfulPayment(update.message);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

// Handle pre-checkout query
async function handlePreCheckoutQuery(query) {
  const payload = JSON.parse(query.invoice_payload);
  
  // Validate the order
  if (payload.type === 'gacha_draw') {
    // Approve the payment
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: query.id,
        ok: true
      })
    });
  } else {
    // Reject unknown orders
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pre_checkout_query_id: query.id,
        ok: false,
        error_message: 'Invalid order type'
      })
    });
  }
}

// Handle successful payment
async function handleSuccessfulPayment(message) {
  const payment = message.successful_payment;
  const payload = JSON.parse(payment.invoice_payload);
  
  if (payload.type === 'gacha_draw') {
    // Process the gacha draw
    const { gachaType, starsAmount, userId } = payload;
    
    // Call your existing gacha draw function
    // This should integrate with your existing database
    const drawnCard = await processGachaDraw(payload.userId, gachaType);
    
    // Send the result to the user
    await sendMessage(userId, `🎉 You drew: ${drawnCard.name} (${drawnCard.rarity})!`);
    
    // Store the payment record
    await storePaymentRecord({
      userId,
      gachaType,
      starsAmount,
      cardId: drawnCard.id,
      paymentId: payment.telegram_payment_charge_id
    });
  }
}

// Helper function to send message
async function sendMessage(chatId, text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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

app.listen(3000, () => {
  console.log('Bot webhook server running on port 3000');
});
