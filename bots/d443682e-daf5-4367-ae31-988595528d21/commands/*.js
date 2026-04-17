if (!user || !user.id) return;

var icons = { "113": "☀️", "116": "⛅", "119": "☁️", "122": "🌥", "143": "🌫", "176": "🌦", "179": "🌨", "182": "🌨", "185": "🌨", "200": "⛈", "227": "❄️", "230": "❄️", "248": "🌫", "260": "🌫", "263": "🌦", "266": "🌦", "281": "🌨", "284": "🌨", "293": "🌧", "296": "🌧", "299": "🌧", "302": "🌧", "305": "🌧", "308": "🌧", "311": "🌨", "314": "🌨", "317": "🌨", "320": "🌨", "323": "❄️", "326": "❄️", "329": "❄️", "332": "❄️", "335": "❄️", "338": "❄️", "350": "🌨", "353": "🌦", "356": "🌧", "359": "🌧", "362": "🌨", "365": "🌨", "368": "❄️", "371": "❄️", "374": "🌨", "377": "🌨", "386": "⛈", "389": "⛈", "392": "⛈", "395": "❄️" };
var daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getIcon(code) { return icons[code] || "🌡"; }

async function fetchWeather(city) {
  var url = "https://wttr.in/" + encodeURIComponent(city) + "?format=j1";
  var res = await HTTP.get({ url: url, timeout: 8000 });
  if (!res || !res.ok || !res.data) return null;
  return res.data;
}

function buildReport(city, data) {
  var cur = data.current_condition[0];
  var area = data.nearest_area ? data.nearest_area[0] : null;
  var loc = area ? (area.areaName[0].value + ", " + area.country[0].value) : city;

  var code = cur.weatherCode || "113";
  var icon = getIcon(code);
  var desc = cur.weatherDesc && cur.weatherDesc[0] ? cur.weatherDesc[0].value : "Unknown";
  var temp = cur.temp_C || "?";
  var feels = cur.FeelsLikeC || temp;
  var humidity = cur.humidity || "?";
  var wind = cur.windspeedKmph || "?";
  var windDir = cur.winddir16Point || "";
  var uv = cur.uvIndex || "?";
  var vis = cur.visibility || "?";
  var pressure = cur.pressure || "?";
  var cloud = cur.cloudcover || "?";

  var t = icon + " <b>Weather — " + loc + "</b>\n" +
    "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
    "📊 <b>" + desc + "</b>\n\n" +
    "🌡 Temperature: <b>" + temp + "°C</b>\n" +
    "🤔 Feels Like: <b>" + feels + "°C</b>\n" +
    "💧 Humidity: <b>" + humidity + "%</b>\n" +
    "💨 Wind: <b>" + wind + " km/h " + windDir + "</b>\n" +
    "☀️ UV Index: <b>" + uv + "/11</b>\n" +
    "👁 Visibility: <b>" + vis + " km</b>\n" +
    "🌀 Pressure: <b>" + pressure + " mb</b>\n" +
    "☁️ Cloud: <b>" + cloud + "%</b>\n";

  // Astronomy
  if (data.weather && data.weather[0] && data.weather[0].astronomy) {
    var astro = data.weather[0].astronomy[0];
    t += "\n🌅 Sunrise: <b>" + astro.sunrise + "</b>\n";
    t += "🌇 Sunset: <b>" + astro.sunset + "</b>\n";
  }

  // 3-day forecast
  if (data.weather && data.weather.length > 0) {
    t += "\n━━━━━━━━━━━━━━━━━━━━━━\n📅 <b>3-Day Forecast:</b>\n\n";
    for (var i = 0; i < data.weather.length && i < 3; i++) {
      var day = data.weather[i];
      var d = new Date(day.date);
      var dayName = i === 0 ? "Today" : daysName[d.getDay()];
      var maxT = day.maxtempC || "?";
      var minT = day.mintempC || "?";
      var dayCode = day.hourly && day.hourly[4] ? day.hourly[4].weatherCode : "113";
      var dayIcon = getIcon(dayCode);
      var dayDesc = day.hourly && day.hourly[4] && day.hourly[4].weatherDesc ? day.hourly[4].weatherDesc[0].value : "";
      t += dayIcon + " <b>" + dayName + "</b>: " + minT + "° — " + maxT + "°C";
      if (dayDesc) t += " <i>" + dayDesc + "</i>";
      t += "\n";
    }
  }

  // Tip
  var tempN = parseInt(temp) || 20;
  var tip = "Enjoy your day! 🌟";
  if (tempN > 35) tip = "Extreme heat! Stay hydrated! 💧🥵";
  else if (tempN > 28) tip = "Hot day! Sunscreen recommended! 🧴";
  else if (tempN > 20) tip = "Perfect weather for outdoor fun! 🏃";
  else if (tempN > 10) tip = "Nice & cool. Light jacket time! 🧥";
  else if (tempN > 0) tip = "Cold outside! Bundle up! 🧣";
  else tip = "Freezing! Stay warm indoors! 🏠❄️";

  t += "\n<blockquote>💡 " + tip + "</blockquote>";
  return t;
}

// Handle callbacks
if (update.callback_query) {
  var cb = request.data;
  Api.answerCallbackQuery({ callback_query_id: request.id });

  if (cb.startsWith("w_")) {
    var city = cb.replace("w_", "");
    var mid = request.message ? request.message.message_id : null;
    if (mid) Api.editMessageText({ chat_id: chat.id, message_id: mid, text: "⏳ <b>Fetching weather for " + city + "...</b>", parse_mode: "HTML" });

    var data = await fetchWeather(city);
    if (!data || !data.current_condition) {
      var err = "❌ <b>City not found!</b>\n\nCouldn't get weather for <b>" + city + "</b>.\nCheck spelling and try again.";
      if (mid) Api.editMessageText({ chat_id: chat.id, message_id: mid, text: err, parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🏠 Menu", callback_data: "menu" }]] } });
      else Api.sendMessage({ chat_id: chat.id, text: err, parse_mode: "HTML" });
      return;
    }

    var report = buildReport(city, data);
    var kb = [[{ text: "🔄 Refresh", callback_data: "w_" + city }], [{ text: "🏠 Menu", callback_data: "menu" }]];
    if (mid) Api.editMessageText({ chat_id: chat.id, message_id: mid, text: report, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
    else Api.sendMessage({ chat_id: chat.id, text: report, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  }

  if (cb === "menu") { Bot.runCommand("/start"); }
  return;
}

// Handle city text
if (msg && msg.text) {
  var city = msg.text.trim();
  if (city.startsWith("/")) return;
  if (city.length < 2 || city.length > 50) {
    Api.sendMessage({ chat_id: chat.id, text: "❌ Send a valid city name.", parse_mode: "HTML" });
    return;
  }

  var loading = await Api.sendMessage({ chat_id: chat.id, text: "⏳ <b>Fetching weather for " + city + "...</b>", parse_mode: "HTML" });
  var loadId = loading && loading.result ? loading.result.message_id : null;

  var data = await fetchWeather(city);
  if (!data || !data.current_condition) {
    var err = "❌ <b>City not found!</b>\n\nCouldn't get weather for <b>" + city + "</b>.\nCheck the spelling and try again.";
    if (loadId) Api.editMessageText({ chat_id: chat.id, message_id: loadId, text: err, parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🏠 Menu", callback_data: "menu" }]] } });
    else Api.sendMessage({ chat_id: chat.id, text: err, parse_mode: "HTML" });
    return;
  }

  var report = buildReport(city, data);
  var kb = [[{ text: "🔄 Refresh", callback_data: "w_" + city }], [{ text: "🏠 Menu", callback_data: "menu" }]];
  if (loadId) Api.editMessageText({ chat_id: chat.id, message_id: loadId, text: report, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
  else Api.sendMessage({ chat_id: chat.id, text: report, parse_mode: "HTML", reply_markup: { inline_keyboard: kb } });
}
