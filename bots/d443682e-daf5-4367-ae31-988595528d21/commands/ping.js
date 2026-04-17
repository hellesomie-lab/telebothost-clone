// Calculate latency logic
// update.message.date is a Unix timestamp in seconds
let latency = Date.now() - (update.message.date * 1000);

// Fetch bot info from Telegram API
let me = await Api.getMe();

// Prepare the response message
let text = "🏓 *Pong!*\n\n" +
           "• Latency: `" + latency + " ms`\n" +
           "• Bot: @" + me.username;

// Send response with the Support Channel button
await Api.sendMessage({
  chat_id: chat.id,
  text: text,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [{ text: "Support Channel", url: "https://t.me/nepcodexcc" }]
    ]
  }
});
