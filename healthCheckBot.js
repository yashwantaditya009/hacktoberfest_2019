const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Define the health check URLs and services
const healthChecks = [
  { name: 'Service 1', url: 'https://service1.example.com' },
  { name: 'Service 2', url: 'https://service2.example.com' },
];

// Function to perform health checks and send status messages
async function performHealthChecks() {
  for (const service of healthChecks) {
    try {
      const response = await fetch(service.url);
      if (response.status === 200) {
        bot.sendMessage(
          process.env.TELEGRAM_CHAT_ID, // Replace with your chat ID
          `${service.name} is UP ✅`
        );
      } else {
        bot.sendMessage(
          process.env.TELEGRAM_CHAT_ID, // Replace with your chat ID
          `${service.name} is DOWN ❌`
        );
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(
        process.env.TELEGRAM_CHAT_ID, // Replace with your chat ID
        `Error checking ${service.name}: ${error.message}`
      );
    }
  }
}

// Periodically check the health status (e.g., every 5 minutes)
setInterval(performHealthChecks, 5 * 60 * 1000);

// Listen for incoming Telegram messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.toLowerCase();

  if (message === '/status') {
    performHealthChecks();
  }
});

console.log('Health Check Bot is running...');
