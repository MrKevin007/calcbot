const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyclient => {
    console.log(`Bot logado como ${readyclient.user.tag}`);
});

client.login(process.env.TOKEN_BOT)