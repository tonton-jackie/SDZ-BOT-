const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// 📌 CONFIG EN MÉMOIRE
let welcomeConfig = null;

// =========================
// READY
// =========================
client.once('clientReady', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// =========================
// COMMANDES
// =========================
client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    console.log("Commande reçue :", interaction.commandName);

    // =========================
    // 📢 /annonce
    // =========================
    if (interaction.commandName === 'annonce') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');
      const image = interaction.options.getAttachment('image');

      if (!channel) {
        return await interaction.reply({
          content: "❌ Salon invalide.",
          ephemeral: true
        });
      }

      await channel.send({
        content: message || '',
        files: image ? [image] : []
      });

      return await interaction.reply({
        content: `✅ Annonce envoyée dans ${channel}`,
        ephemeral: true
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
        message: message
      };

      return await interaction.reply({
        content: `✅ Welcome configuré dans ${channel}`,
        ephemeral: true
      });
    }

  } catch (err) {
    console.error("❌ Erreur interaction:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Une erreur est survenue.",
        ephemeral: true
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

    // 🔁 remplacement variables
    const msg = welcomeConfig.message
      .replaceAll("{user}", `${member}`)
      .replaceAll("{server}", member.guild.name);

    const embed = new EmbedBuilder()
      .setTitle("🌟 Bienvenue sur le serveur !")
      .setDescription(msg)
      .setColor(0x5865F2)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage("https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif")
      .addFields(
        { name: "👤 Membre", value: member.user.tag, inline: true },
        { name: "📊 Membres", value: `${member.guild.memberCount}`, inline: true }
      )
      .setFooter({
        text: "Bienvenue ❤️",
        iconURL: member.guild.iconURL()
      })
      .setTimestamp();

    channel.send({ embeds: [embed] });

  } catch (err) {
    console.error("Erreur welcome:", err);
  }
});

// =========================
// DEBUG
// =========================
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// =========================
// LOGIN
// =========================
client.login(process.env.TOKEN);