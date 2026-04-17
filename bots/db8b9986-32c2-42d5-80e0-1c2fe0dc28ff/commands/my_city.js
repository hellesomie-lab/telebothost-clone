let home = await User.get("home_city");
if (!home) {
  Bot.sendMessage("📍 You haven't saved a city yet! Just send me a city name and click 'Set as Home'.");
} else {
  Bot.runCommand("/weather", { city: home });
}
