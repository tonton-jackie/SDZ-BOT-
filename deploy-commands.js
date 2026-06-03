const { REST, Routes, SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();

const commands = [
  // 📢 /annonce
  new SlashCommandBuilder()
    .setName('annonce')
    .setDescription('Publier une annonce dans un salon')
    .addChannelOption(option =>
      option
        .setName('salon')
        .setDescription('Salon où envoyer le message')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Message à publier')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option
        .setName('image')
        .setDescription('Image à envoyer')
        .setRequired(false)
    ),

  // 👋 /setwelcome
  new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Définir le salon de bienvenue')
    .addChannelOption(option =>
      option
        .setName('salon')
        .setDescription('Salon de bienvenue')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Déploiement des commandes...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Commandes déployées avec succès');
  } catch (err) {
    console.error('❌ Erreur déploiement:', err);
  }
})();