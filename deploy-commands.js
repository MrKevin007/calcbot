const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.existsSync(commandsPath) ? fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')) : [];

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command && command.data) {
        commands.push(command.data.toJSON());
    }
}

if (!process.env.TOKEN_BOT) {
    console.error('TOKEN_BOT não encontrado em .env');
    process.exit(1);
}

if (!process.env.CLIENT_ID) {
    console.error('CLIENT_ID não encontrado em .env (ID da aplicação).');
    process.exit(1);
}

// Se GUILD_ID estiver definido, registra no guild (imediato). Caso contrário registra globalmente
// (leva até 1 hora para propagar para todos os servers).

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_BOT);

(async () => {
    try {
        if (commands.length === 0) {
            console.log('Nenhum comando encontrado para registrar. Abortando.');
            return;
        }

        if (process.env.GUILD_ID) {
            console.log(`Registrando ${commands.length} comandos no guild ${process.env.GUILD_ID}...`);
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            console.log(`Comandos registrados no guild com sucesso. Total registrado: ${data.length}`);
        } else {
            console.log(`Registrando ${commands.length} comandos globalmente (application commands)...`);
            const data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log(`Comandos registrados globalmente com sucesso. Total registrado: ${data.length}`);
            console.log('Aviso: comandos globais podem levar até 1 hora para aparecerem em todos os servidores.');
        }
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();
