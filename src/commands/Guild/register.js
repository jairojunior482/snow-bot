import { Client, Message } from "discord.js";

import Guild from "../../models/Guild";

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {string[]} args 
 */

async function execute(client, msg, args) {
  const permission = msg.member.permissions.has("ADMINISTRATOR");
  if (!permission) return;
  const guild_id = msg.guild.id;
  const existsGuild = await Guild.findOne({ guild_id });
  
  if (existsGuild)  {
    return msg.channel.send("Guilda já registrada");
  }
  await Guild.create({
    guild_id
  });
  return msg.channel.send("Guild registrada com sucesso!");
}

export default {
  name: "guildrg",
  execute
}