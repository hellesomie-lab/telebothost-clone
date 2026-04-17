// A simple greeting that uses the user's Telegram First Name
Bot.sendMessage(`Hello there, ${user.first_name}! 👋\n\nWelcome to my amazing new bot!`);

// Let's also send an interactive button just to show off what the platform can do!
await ctx.reply("Here is a quick menu for you:", {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Visit TeleBotHost Clone", url: "https://telebothost-clone.vercel.app" }],
      [{ text: "Click Me (Callback)", callback_data: "ping" }]
    ]
  }
});
