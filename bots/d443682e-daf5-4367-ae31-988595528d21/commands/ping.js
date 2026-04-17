// Calculate latency based on the Telegram message timestamp
// ctx.message.date is in seconds, so we multiply by 1000
let latency = Date.now() - (ctx.message.date * 1000);

// Fetch bot info once
let me = await Api.getMe();

// Send response
Bot.sendMessage(`🏓 *Pong!*\n\n• Latency: \`${latency} ms\`\n• Bot: @${me.username}`, {
  parse_mode: "Markdown"
});
