await Api.sendMessage(chat.id, "Welcome " + user.first_name + "! Choose an option to continue:", {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "My Profile", callback_data: "profile" },
        { text: "Settings", callback_data: "settings" }
      ],
      [
        { text: "Help Support 🚀", url: "https://telebothost-clone.vercel.app/" }
      ]
    ]
  }
});
