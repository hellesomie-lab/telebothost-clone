if (params) {
  await User.set("home_city", params);
  Bot.sendMessage("✅ Saved `" + params + "` as your home city! You can now use /my_city to view it instantly.");
}
