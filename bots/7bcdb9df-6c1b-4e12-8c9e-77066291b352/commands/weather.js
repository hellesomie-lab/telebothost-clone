// 1. Extract the city from the user's message
// If they type: "/weather New York", the city becomes "New York"
const city = message.replace("/weather", "").trim();

// 2. Check if they actually provided a city
if (!city) {
  await Bot.sendMessage("Oops! You forgot the city name. ❌\n\nTry it like this: /weather London");
  return;
}

// 3. Let them know we are processing it
await Bot.sendMessage(`🌤 Processing weather data for *${city}*...`, { parse_mode: "Markdown" });

try {
  // 4. Fetch the weather data using a public URL (format 3 returns a clean emoji summary)
  const response = await fetch("https://wttr.in/" + city + "?format=3");
  const weatherText = await response.text();
  
  // 5. Send the final report back to the user
  if (weatherText.includes("Unknown location")) {
     await Bot.sendMessage("❌ Couldn't find that city. Please check the spelling!");
  } else {
     await Bot.sendMessage(`Here is your current weather report:\n\n${weatherText}`);
  }

} catch (error) {
  // 6. Handle any connection errors gracefully
  await Bot.sendMessage("⚠️ Sorry, the weather service is currently unavailable.");
}
