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

// ✅ BOT READY
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});


// =========================
// 📢 SLASH COMMANDS
// =========================
client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    console.log("Commande reçue :", interaction.commandName);

    // 📢 /annonce
    if (interaction.commandName === 'annonce') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');
      const image = interaction.options.getAttachment('image');

      if (!message && !image) {
        return interaction.reply({
          content: "❌ Tu dois mettre un message ou une image.",
          ephemeral: true
        });
      }

      await channel.send({
        content: message || '',
        files: image ? [image] : []
      });

      return interaction.reply({
        content: `✅ Annonce envoyée dans ${channel}`,
        ephemeral: true
      });
    }

  } catch (err) {
    console.error("Erreur interaction:", err);

    if (!interaction.replied) {
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
    const channelId = 'ID_DU_SALON'; // 🔥 à remplacer

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Bienvenue !")
      .setDescription(`Bienvenue ${member} sur le serveur 🎉`)
      .setColor(0x00ff99)
      .setThumbnail(member.user.displayAvatarURL());

    channel.send({ embeds: [embed] });

  } catch (err) {
    console.error("Erreur welcome:", err);
  }
});


// =========================
// 🔧 DEBUG + LOGIN
// =========================
client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(process.env.TOKEN);