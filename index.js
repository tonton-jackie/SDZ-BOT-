const {
  Client,
  GatewayIntentBits
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'annonce') return;

  try {
    const channel = interaction.options.getChannel('salon');
    const message = interaction.options.getString('message');
    const image = interaction.options.getAttachment('image');

    // ❗ obligatoire : message OU image
    if (!message && !image) {
      return interaction.reply({
        content: '❌ Tu dois mettre un message ou une image.',
        ephemeral: true
      });
    }

    await channel.send({
      content: message || '',
      files: image ? [image] : []
    });

    await interaction.reply({
      content: `✅ Annonce envoyée dans ${channel}`,
      ephemeral: true
    });

  } catch (err) {
    console.error(err);

    if (!interaction.replied) {
      await interaction.reply({
        content: '❌ Une erreur est survenue.',
        ephemeral: true
      });
    }
  }
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(process.env.TOKEN);