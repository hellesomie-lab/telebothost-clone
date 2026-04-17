Bot.sendMessage("🌦 *Advanced Weather Bot*\n\nWelcome " + user.first_name + "! I provide real-time weather updates worldwide.\n\nUse the buttons below to manage your settings or just send me a city name!", {
  parse_mode: "Markdown",
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "📍 View My Saved City", callback_data: "/my_city" }],
      [{ text: "⚙️ User Settings", callback_data: "/settings" }]
    ]
  })
})
