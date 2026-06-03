const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const path = require('path');
require('dotenv').config();

// =========================
// CLIENT
// =========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =========================
// ANTI CRASH
// =========================
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// =========================
// CONFIG WELCOME
// =========================
let welcomeConfig = null;

// =========================
// READY
// =========================
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// =========================
// COMMANDES
// =========================
client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    // 📢 /annonce
    if (interaction.commandName === 'annonce') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');

      await channel.send({ content: message });

      return interaction.reply({
        content: "✅ Annonce envoyée",
        flags: 64
      });
    }

    // 👋 /setwelcome
    if (interaction.commandName === 'setwelcome') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');

      welcomeConfig = {
        channelId: channel.id,
        message
      };

      return interaction.reply({
        content: `✅ Welcome configuré dans ${channel}`,
        flags: 64
      });
    }

  } catch (err) {
    console.error(err);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Erreur bot",
        flags: 64
      });
    }
  }
});

// =========================
// WELCOME SYSTEM (SIMPLE + IMAGE LOCALE)
// =========================
client.on('guildMemberAdd', async (member) => {
  try {

    if (!welcomeConfig) return;

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) return;

    const msg = welcomeConfig.message
      .replaceAll("{user}", `${member}`)
      .replaceAll("{server}", member.guild.name);

    await channel.send({
      content: `👋 Bienvenue ${member} sur le serveur SDZ !\n\n> ${msg}`,
      files: [path.join(__dirname, 'assets', 'welcome.png')]
    });

  } catch (err) {
    console.error("Welcome error:", err);
  }
});

// =========================
// LOGIN
// =========================
client.login(process.env.TOKEN)
  .then(() => console.log("🔑 Login OK"))
  .catch(console.error);