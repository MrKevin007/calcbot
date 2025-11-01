const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soma')
        .setDescription('Soma dois números')
        .addNumberOption(option => option.setName('a').setDescription('Primeiro número').setRequired(true))
        .addNumberOption(option => option.setName('b').setDescription('Segundo número').setRequired(true))
        .setContexts(contexts = RestOrArray = InteractionContextType[0,1,2])
        ,

    async execute(interaction) {
        const a = interaction.options.getNumber('a');
        const b = interaction.options.getNumber('b');
        if (typeof a !== 'number' || typeof b !== 'number') {
            return interaction.reply({ content: 'Forneça dois números válidos.', ephemeral: true });
        }

        const resultado = a + b;
        await interaction.reply(`O resultado da soma é: ${resultado}`);
    }
};