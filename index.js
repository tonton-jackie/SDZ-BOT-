const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

require('dotenv').config();

// 📌 salon welcome (reset si restart Railway)
let welcomeChannelId = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

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
  if (!interaction.isChatInputCommand()) return;

  console.log("Commande reçue :", interaction.commandName);

  try {

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

      if (!channel) {
        return await interaction.reply({
          content: "❌ Salon invalide.",
          ephemeral: true
        });
      }

      welcomeChannelId = channel.id;

      return await interaction.reply({
        content: `✅ Salon de bienvenue défini sur ${channel}`,
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
// 👋 WELCOME MESSAGE
// =========================
client.on('guildMemberAdd', async (member) => {
  try {
    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Bienvenue !")
      .setDescription(
        `🎉 Bienvenue ${member} !\n` +
        `Bienvenue sur **${member.guild.name}** ❤️`
      )
      .setColor(0x00ff99)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage("https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif")
      .setFooter({ text: "Amuse-toi bien 😄" });

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