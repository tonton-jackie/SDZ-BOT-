const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

console.log('=== DEBUG RAILWAY ===');
console.log('TOKEN présent :', !!process.env.TOKEN);
console.log('Longueur TOKEN :', process.env.TOKEN?.length || 0);
console.log('CLIENT_ID présent :', !!process.env.CLIENT_ID);
console.log('GUILD_ID présent :', !!process.env.GUILD_ID);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('clientReady', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.on('error', console.error);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

client.login(process.env.TOKEN)
  .catch(err => {
    console.error('❌ Erreur login Discord :', err);
  });