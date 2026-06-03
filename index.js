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
// WELCOME SYSTEM (CANVAS + AVATAR + TON IMAGE)
// =========================
client.on('guildMemberAdd', async (member) => {
  try {

    if (!welcomeConfig) return;

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) return;

    const msg = welcomeConfig.message
      .replaceAll("{user}", `${member}`)
      .replaceAll("{server}", member.guild.name);

    // =========================
    // CANVAS IMAGE
    // =========================
    const canvas = createCanvas(1000, 350);
    const ctx = canvas.getContext('2d');

    // 👉 ton image de fond
    const background = await loadImage(
      path.join(__dirname, 'assets', 'welcome.png')
    );

    ctx.drawImage(background, 0, 0, 1000, 350);

    // =========================
    // TEXTE
    // =========================
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 45px Sans";
    ctx.fillText("Bienvenue", 50, 120);

    ctx.font = "30px Sans";
    ctx.fillText(member.user.username, 50, 180);

    ctx.font = "20px Sans";
    ctx.fillText(`Sur ${member.guild.name}`, 50, 240);

    // =========================
    // AVATAR CIRCULAIRE
    // =========================
    const avatar = await loadImage(
      member.user.displayAvatarURL({ extension: "png", size: 256 })
    );

    ctx.save();
    ctx.beginPath();
    ctx.arc(850, 175, 80, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, 770, 95, 160, 160);
    ctx.restore();

    // =========================
    // ENVOI
    // =========================
    await channel.send({
      content: `👋 Bienvenue ${member} sur le serveur SDZ !\n\n> ${msg}`,
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