const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'annonce') {
    const channel = interaction.options.getChannel('salon');
    const message = interaction.options.getString('message');

    await channel.send({
      content: message
    });

    await interaction.reply({
      content: `Annonce envoyée dans ${channel}.`,
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);