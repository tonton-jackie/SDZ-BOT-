const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const path = require('path');
const { createCanvas, loadImage } = require('canvas');
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

    // 👋 /setwelcome (SEULEMENT SALON)
    if (interaction.commandName === 'setwelcome') {
      const channel = interaction.options.getChannel('salon');

      welcomeConfig = {
        channelId: channel.id
      };

      return interaction.reply({
        content: `✅ Welcome activé dans ${channel}`,
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
// WELCOME SYSTEM
// =========================
client.on('guildMemberAdd', async (member) => {
  try {

    if (!welcomeConfig) return;

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) return;

    // =========================
    // MESSAGE FIXE
    // =========================
    const message =
`@${member.user.username} fait son apparition sur le serveur SDZ ! 🎉

On t’attendait avec impatience, installe-toi confortablement 🪑`;

    // =========================
    // CANVAS
    // =========================
    const canvas = createCanvas(1000, 350);
    const ctx = canvas.getContext('2d');

    // fond
    const background = await loadImage(
      path.join(__dirname, 'assets', 'welcome.png')
    );

    ctx.drawImage(background, 0, 0, 1000, 350);

    // =========================
    // AVATAR À GAUCHE
    // =========================
    const avatar = await loadImage(
      member.user.displayAvatarURL({ extension: "png", size: 256 })
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 175, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 70, 95, 160, 160);
    ctx.restore();

    // =========================
    // ENVOI
    // =========================
    await channel.send({
      content: message,
      files: [{
        attachment: canvas.toBuffer(),
        name: "welcome-card.png"
      }]
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