const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Coleção para comandos carregados dinamicamente
client.commands = new Collection();

// Carrega os arquivos de comando em src/commands
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Comandos slash exportam a propriedade `data` (SlashCommandBuilder) e `execute`
        if (command && command.data && command.execute) {
            client.commands.set(command.data.name ?? command.data.name, command);
        }
    }
}

client.once(Events.ClientReady, readyclient => {
    console.log(`Bot logado como ${readyclient.user.tag}`);
});

// Handler para interações (slash commands)
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Erro ao executar comando:', error);
        if (interaction.replied || interaction.deferred) {
            try { await interaction.followUp({ content: 'Houve um erro ao executar este comando.', ephemeral: true }); } catch {}
        } else {
            try { await interaction.reply({ content: 'Houve um erro ao executar este comando.', ephemeral: true }); } catch {}
        }
    }
});

client.login(process.env.TOKEN_BOT);