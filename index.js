const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

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
// IMAGE (GITHUB RAW)
// =========================
// ⚠️ remplace si besoin ton repo
const WELCOME_IMAGE =
  "https://raw.githubusercontent.com/gkreol/sdz-bot/main/assets/welcome.png";

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

    console.log("📩 Commande reçue:", interaction.commandName);

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
// 👋 WELCOME SYSTEM
// =========================
client.on('guildMemberAdd', async (member) => {
  try {

    if (!welcomeConfig) return;

    const channel = member.guild.channels.cache.get(welcomeConfig.channelId);
    if (!channel) return;

    const msg = welcomeConfig.message
      .replaceAll("{user}", `${member}`)
      .replaceAll("{server}", member.guild.name);

    const embed = new EmbedBuilder()
      .setTitle("🌟 Bienvenue sur le serveur !")
      .setDescription(msg)
      .setColor(0x5865F2)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage(WELCOME_IMAGE) // 👈 bannière image
      .setFooter({ text: `Membres : ${member.guild.memberCount}` });

    await channel.send({
      content: `👋 Bienvenue ${member} !`,
      embeds: [embed]
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