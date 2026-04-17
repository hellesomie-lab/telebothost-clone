Api.sendMessage({
  chat_id: chat.id,
  text: "🌤 <b>Weather Bot</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n" +
    "Get <b>real-time</b> weather for any city!\n\n" +
    "<blockquote>🌡 Temperature & feels like\n💧 Humidity & wind speed\n👁 Visibility & UV index\n📅 3-day forecast</blockquote>\n\n" +
    "📍 <b>Send a city name to begin!</b>",
  parse_mode: "HTML",
  reply_markup: { inline_keyboard: [
    [{ text: "🌍 London", callback_data: "w_London" }, { text: "🗽 New York", callback_data: "w_New York" }],
    [{ text: "🗼 Tokyo", callback_data: "w_Tokyo" }, { text: "🕌 Dubai", callback_data: "w_Dubai" }]
  ]}
});