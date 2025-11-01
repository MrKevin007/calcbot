const {SlashCommandBuilder, InteractionContextType} = require('discord.js');

module.exports = {

    data:new SlashCommandBuilder()
        .setName('divisão')
        .setDescription('Realiza a divisão entre dois numeros.')
        .addNumberOption(option => option.setName('a').setDescription('Numero que vai ser dividido').setRequired(true))
        .addNumberOption(option => option.setName('b').setDescription('Divisor').setRequired(true))
        .setContexts(contexts = RestOrArray = InteractionContextType[0,1,2])
        ,

    async execute(interaction) {
        const a = interaction.options.getNumber('a');
        const b = interaction.options.getNumber('b');
        if (typeof a != 'number' || typeof b != 'number') {
            return interaction.reply({content: 'Forneça numeros validos.', ephemeral: true })
        }
        if (b === 0) {
            return interaction.reply({content: 'Não é possivel dividir por 0.'})
        }
        const resultado = a / b;
        await interaction.reply(`O resultado da divisão é: ${resultado}`)
    }
    
}