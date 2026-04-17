// /ping command — test bot latency
let start = Date.now()
let res = await Api.getMe()
let latency = Date.now() - start
Bot.sendMessage("🏓 Pong!\n\n• Latency: " + latency + " ms\n• Bot: @" + res.result.username)