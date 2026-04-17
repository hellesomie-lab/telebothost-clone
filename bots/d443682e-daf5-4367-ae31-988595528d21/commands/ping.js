// Start timer
let t0 = Date.now();

// Fetch bot info
let me = await Api.getMe();

// End timer
let t1 = Date.now();
let latency = (t1 - t0) + " ms";

// Use the Bot helper for automatic chat targeting
Bot.sendMessage(`🏓 *Pong!*\n\n• Latency: \`${latency}\`\n• Bot: @${me.username}`, {
  parse_mode: "Markdown"
});
