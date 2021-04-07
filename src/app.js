import Discord from "discord.js";

import "dotenv/config";

const client = new Discord.Client();

const client_token = process.env.CLIENT_TOKEN;

client.login(client_token);