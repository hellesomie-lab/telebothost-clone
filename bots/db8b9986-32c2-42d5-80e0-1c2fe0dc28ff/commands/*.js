// Any text sent that isn't a command is treated as a city search
if (message && !message.startsWith("/")) {
  Bot.runCommand("/weather", { city: message });
}
