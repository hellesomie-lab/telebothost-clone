let t0 = Date.now();
let me = await Api.getMe();
let t1 = Date.now();

let latency = (t1 - t0) + " ms";
Api.sendMessage({
  chat_id: chat.id,
  text: `🏓 Pong!\nLatency: *${latency}*\nBot: @${me.result.username}`,
  parse_mode: "Markdown"
});
