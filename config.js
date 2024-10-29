import dotenv from 'dotenv';

dotenv.config();

export default {
    ds_bot_token: process.env.DISCORD_BOT_TOKEN,
    mk_webhook_url: process.env.MAKE_WEBHOOK_URL,
  };