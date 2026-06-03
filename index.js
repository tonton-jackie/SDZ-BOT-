const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

require('dotenv').config();

// 📌 salon de bienvenue (reset si reboot Railway)
let welcomeChannelId = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =========================
// BOT READY
// =========================
client.once('clientReady', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// =========================
// SLASH COMMANDS
// =========================
client.on('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    console.log("Commande :", interaction.commandName);

    // 📢 /annonce
    if (interaction.commandName === 'annonce') {
      const channel = interaction.options.getChannel('salon');
      const message = interaction.options.getString('message');
      const image = interaction.options.getAttachment('image');

      await channel.send({
        content: message || '',
        files: image ? [image] : []
      });

      return interaction.reply({
        content: `✅ Annonce envoyée dans ${channel}`,
        ephemeral: true
      });
    }

    // 👋 /setwelcome
    if (interaction.commandName === 'setwelcome') {
      const channel = interaction.options.getChannel('salon');

      welcomeChannelId = channel.id;

      return interaction.reply({
        content: `✅ Salon de bienvenue défini sur ${channel}`,
        ephemeral: true
      });
    }

  } catch (err) {
    console.error("Erreur interaction:", err);

    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Erreur bot.",
        ephemeral: true
      });
    }
  }
});

// =========================
// 👋 WELCOME MESSAGE (GIF)
// =========================
client.on('guildMemberAdd', async (member) => {
  try {
    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 Bienvenue sur le serveur !")
      .setDescription(
        `🎉 Bienvenue ${member} !\n` +
        `On est heureux de t’accueillir sur **${member.guild.name}** ❤️`
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
// DEBUG + LOGIN
// =========================
client.on('error', console.error);
process.on('unhandledRejection', console.error);

client.login(process.env.TOKEN);