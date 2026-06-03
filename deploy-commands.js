const {
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType
} = require('discord.js');

require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('annonce')
    .setDescription('Publier une annonce')

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
        .setDescription('Message (optionnel)')
        .setRequired(false)
    )

    .addAttachmentOption(option =>
      option
        .setName('image')
        .setDescription('Image depuis ton ordinateur')
        .setRequired(false)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Déploiement de la commande...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Commande déployée');
  } catch (err) {
    console.error(err);
  }
})();