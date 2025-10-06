# Telegram Stars Integration Setup

This guide explains how to set up Telegram Stars payments for your Pullemon gacha app.

## Overview

Based on the [Telegram Bot Payments API documentation](https://core.telegram.org/bots/payments-stars), we need to implement a proper bot backend to handle Telegram Stars payments. The current implementation is a simulation for testing purposes.

## Current Implementation Status

✅ **Completed:**
- Removed all TON/Web3 wallet connections
- Updated UI to show Telegram Stars pricing (50 stars normal, 100 stars premium)
- Implemented payment simulation for testing
- Updated all components to use Stars instead of TON

🔄 **Next Steps for Production:**

## 1. Create a Telegram Bot

1. Contact [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Enable payments with `/mybots` → Select your bot → Bot Settings → Payments
4. Get your bot token

## 2. Backend Implementation

You'll need to create a backend service that:

### A. Handles Bot API Webhooks
```javascript
// Example webhook handler
app.post('/webhook', (req, res) => {
  const update = req.body;
  
  if (update.pre_checkout_query) {
    // Handle pre-checkout query
    handlePreCheckoutQuery(update.pre_checkout_query);
  }
  
  if (update.message?.successful_payment) {
    // Handle successful payment
    handleSuccessfulPayment(update.message);
  }
});
```

### B. Send Invoices
```javascript
// Send invoice to user
const sendInvoice = async (chatId, starsAmount, gachaType) => {
  const response = await fetch(`${BOT_API_URL}${BOT_TOKEN}/sendInvoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      title: `${gachaType} Gacha Draw`,
      description: `Draw 1 card from ${gachaType} gacha machine`,
      payload: JSON.stringify({
        type: "gacha_draw",
        gachaType,
        starsAmount
      }),
      provider_token: "", // Empty for digital goods
      currency: "XTR", // Telegram Stars
      prices: [{
        label: `${gachaType} Gacha Draw`,
        amount: starsAmount
      }]
    })
  });
  
  return response.json();
};
```

### C. Handle Payment Flow
1. **Pre-checkout**: Validate the order
2. **Successful payment**: Process the gacha draw
3. **Deliver goods**: Add card to user's inventory

## 3. Environment Variables

Add to your `.env` file:
```env
VITE_TELEGRAM_BOT_TOKEN=your_pokestash_bot_token_here
```

**Important**: Replace `your_pokestash_bot_token_here` with your actual bot token from @BotFather.

## 4. Testing

### Test Environment
- Use Telegram's test environment for development
- Test with [@DurgerKingBot](https://t.me/DurgerKingBot) for invoice examples

### Production Checklist
- [ ] Bot has 2-step verification enabled
- [ ] Terms and conditions implemented (`/terms` command)
- [ ] Customer support implemented (`/support` command)
- [ ] Payment dispute handling (`/paysupport` command)
- [ ] Stable server infrastructure
- [ ] Data backups configured

## 5. Pricing Structure

- **Normal Gacha**: 50 Stars (~$1.50)
- **Premium Gacha**: 100 Stars (~$3.00)
- **Expected Value**: 1% hit rate for $100 card
- **Average Cost**: ~$150 to hit (100 draws × $1.50)

## 6. Integration with Current App

The current frontend is ready for Telegram Stars integration. You just need to:

1. Replace the simulation in `useTelegramStars.tsx` with actual bot API calls
2. Set up the backend bot service
3. Configure webhooks to handle payments
4. Test in Telegram's test environment

## Resources

- [Telegram Bot Payments API](https://core.telegram.org/bots/payments-stars)
- [Bot API Manual - Payments](https://core.telegram.org/bots/api#payments)
- [Telegram Bot Platform Developer Terms](https://core.telegram.org/bots/terms)
