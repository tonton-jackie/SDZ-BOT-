const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

const {
  createCanvas,
  loadImage
} = require('canvas');

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
// CONFIG MEMORY
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

    console.log("📩 Commande:", interaction.commandName);

    // =========================
    // 📢 /annonce
    // =========================
    if (interaction.commandName === 'annonce') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');

      await channel.send({ content: message });

      return interaction.reply({
        content: "✅ Annonce envoyée",
        flags: 64
      });
    }

    // =========================
    // 👋 /setwelcome
    // =========================
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
// 🎨 WELCOME IMAGE (FIX RAILWAY)
// =========================
async function createWelcomeCard(member) {
  const canvas = createCanvas(900, 300);
  const ctx = canvas.getContext("2d");

  // fond
  ctx.fillStyle = "#1e1f22";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // titre
  ctx.fillStyle = "#ffffff";
  ctx.font = "40px sans-serif";
  ctx.fillText("Bienvenue 👋", 320, 120);

  // pseudo
  ctx.font = "30px sans-serif";
  ctx.fillText(member.user.username, 320, 180);

  // membres
  ctx.font = "20px sans-serif";
  ctx.fillText(`Membres: ${member.guild.memberCount}`, 320, 230);

  // avatar
  const avatar = await loadImage(
    member.user.displayAvatarURL({ extension: "png", size: 128 })
  );

  ctx.save();
  ctx.beginPath();
  ctx.arc(120, 150, 80, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(avatar, 40, 70, 160, 160);
  ctx.restore();

  return canvas.toBuffer();
}

// =========================
// 👋 WELCOME SYSTEM
// =========================
client.on('guildMemberAdd', async (member) => {
  try {
    if (!welcomeConfig) return;

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) return;

    const image = await createWelcomeCard(member);

    const msg = welcomeConfig.message
      .replaceAll("{user}", `${member}`)
      .replaceAll("{server}", member.guild.name);

    const embed = new EmbedBuilder()
      .setTitle("🌟 Bienvenue !")
      .setDescription(msg)
      .setColor(0x5865F2)
      .setImage("attachment://welcome.png")
      .setFooter({ text: "Bienvenue ❤️" });

    await channel.send({
      embeds: [embed],
      files: [{ attachment: image, name: "welcome.png" }]
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