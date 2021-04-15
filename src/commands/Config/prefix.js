import Guild from "../../models/Guild";

import { Client, Message } from "discord.js";

async function execute(client, msg, args) {
  const guild_id = msg.guild.id;
  const hasPermission = msg.member.permissions.has("ADMINISTRATOR");

  if (!hasPermission) {
    msg.channel
      .send("Voçê precisa ser um adminstrador para ultilizar esse comando");
  }

  const { prefix } = await Guild.findOne({ guild_id });
  const newPrefix = args[0];
  if (!newPrefix)  {
    return msg.channel.send("Voçê precisa digitar um novo prefix");
  }

  if (prefix == newPrefix) {
    return msg.channel.send("Esse prefixo já esta sendo usado");
  }

  await Guild.findOneAndUpdate({ guild_id }, {
    $set: {
      "prefix": newPrefix
    }
  });
  return msg.channel.send(`Prefixo alterado para ${newPrefix}`);
}

export default {
  name: "prefix",
  aliases: ["prefixo"],
  execute
}