const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
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
  } catch (err) {
    console.error('Erreur dans interactionCreate:', err);
    if (interaction.replied || interaction.deferred) {
      return;
    }
    await interaction.reply({
      content: 'Une erreur est survenue.',
      ephemeral: true
    });
  }
});

client.on('error', (err) => {
  console.error('Erreur client Discord:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

client.login(process.env.TOKEN);