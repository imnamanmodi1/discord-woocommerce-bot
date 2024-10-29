import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
import config from './config.js';
const {ds_bot_token,mk_webhook_url} = config;

(async () => {
    if (!mk_webhook_url || !ds_bot_token) {
        console.log("Empty Webhook URL or Bot Token, check config.js");
        return;
    }
})();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        let orderID = interaction.customId.split('_')[1];
        // Forward interaction data to the Make webhook
        const response = await fetch(mk_webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                custom_id: orderID ? orderID : interaction.customId,
                user_id: interaction.user.id,
                channel_id: interaction.channelId,
                message_id: interaction.message.id
            })
        });

        // let orderID = interaction.customId.split('_')[1];

        // Check if the webhook was successful
        if (response.ok) {
            await interaction.reply({ content: `Fetching order details for order #${orderID}.`, ephemeral: true });
        } else {
            await interaction.reply({ content: 'Failed to fetch data & forward to webhook.', ephemeral: true });
        }
    } catch (error) {
        console.error('Error forwarding to Make webhook:', error);
        await interaction.reply({ content: 'There was an error processing your request.', ephemeral: true });
    }
});

client.login(ds_bot_token);
