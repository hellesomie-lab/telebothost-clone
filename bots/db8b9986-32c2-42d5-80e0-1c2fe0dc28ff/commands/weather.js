// Get city from params (search) or saved city
let city = params || options.city || await User.get("home_city") || "London";
let units = await User.get("temp_unit") || "metric"; // metric = C, imperial = F

// Track global statistics across the platform
let globalTotal = await Global.get("total_hits") || 0;
await Global.set("total_hits", globalTotal + 1);

msg.sendChatAction("typing");

// Fetch Weather Data (wttr.in provides JSON)
let url = "https://wttr.in/" + encodeURIComponent(city) + "?format=j1";
let res = await HTTP.get(url);

if (!res.ok) {
  return Bot.sendMessage("❌ Error: Could not find weather for `" + city + "`. Check the spelling!");
}

let data = res.data.current_condition[0];
let area = res.data.nearest_area[0];
let temp = units === "metric" ? data.temp_C : data.temp_F;
let feel = units === "metric" ? data.FeelsLikeC : data.FeelsLikeF;

let weatherText = "🌡 *Weather in " + area.areaName[0].value + "* (" + area.country[0].value + ")\n\n" +
  "✨ *Condition:* " + data.weatherDesc[0].value + "\n" +
  "🌡 *Temp:* " + temp + "°" + (units === "metric" ? "C" : "F") + "\n" +
  "🤔 *Feels Like:* " + feel + "°" + (units === "metric" ? "C" : "F") + "\n" +
  "💧 *Humidity:* " + data.humidity + "%\n" +
  "💨 *Wind:* " + data.windspeedKmph + " km/h\n\n" +
  "📈 _Total Platform Queries: " + (globalTotal + 1) + "_";

await Api.sendMessage({
  text: weatherText,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🔄 Refresh", callback_data: "/weather " + city },
        { text: "⭐ Set as Home", callback_data: "/save_city " + city }
      ],
      [{ text: "🔙 Back to Home", callback_data: "/start" }]
    ]
  }
});
