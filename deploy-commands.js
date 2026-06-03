const { REST, Routes, SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();

const commands = [

  new SlashCommandBuilder()
    .setName('annonce')
    .setDescription('Envoyer une annonce')
    .addChannelOption(o =>
      o.setName('salon')
        .setDescription('Salon')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(o =>
      o.setName('message')
        .setDescription('Message')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Configurer le welcome')
    .addChannelOption(o =>
      o.setName('salon')
        .setDescription('Salon bienvenue')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(o =>
      o.setName('message')
        .setDescription('Message ({user}, {server})')
        .setRequired(true)
    )
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🚀 Déploiement...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log("✅ Commands OK");
  } catch (err) {
    console.error(err);
  }
})();