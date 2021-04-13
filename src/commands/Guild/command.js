import Guild from "../../models/Guild";

import { Client, Message, MessageEmbed } from "discord.js";

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */

async function execute(client, msg, args) {
  const hasPermission = msg.member.permissions.has("ADMINISTRATOR");
  if (!hasPermission) return;
  const subCommand = args[0];
  const guild_id = msg.guild.id;
  const guild = await Guild.findOne({ guild_id });

  const channelInfo = client.channels.cache.get(guild.channels.commands.id);

  if (!subCommand) {
    const channelInfoEmbed = new MessageEmbed()
      .setColor("#0974ed")
      .setTitle("Informações sobre o canal")
      .addFields(
        // {
        //   name: "Canal",
        //   value: `\`\`\`<#${channelInfo.id}>\`\`\``
        // },
        {
          name: "Canal",
          value: `<#${channelInfo.id}>`
        },
        {
          name: "Id",
          value: `\`\`\`${channelInfo.id}\`\`\``
        },
        {
          name: "Status",
          value: `\`\`\`${guild.channels.commands.status ? "ativado" : "desativado"}\`\`\``
        }
      )
      .setTimestamp();
    return msg.channel.send(channelInfoEmbed);
  }

  if (["add", "set"].includes(subCommand)) {
    const mentionChannel = msg.mentions.channels.first();
    if (!mentionChannel) {
      return msg.channel.send("Voçê precisa mencioar um canal");
    }
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.commands.id": mentionChannel.id
      }
    });
    return msg.channel.send(`${mentionChannel.name} Setado com sucesso`);
  }

  if (subCommand == "on") {
    if (guild.channels.commands.status) {
      return msg.channel.send("Canal já esta ativado");
    }
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.commands.status": true
      }
    });
    return msg.channel.send("Canal de comandos ativado");
  }

  if (subCommand == "off") {
    if (!guild.channels.commands.status) {
      return msg.channel.send("Canal já esta desativado");
    }
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.commands.status": false
      }
    });
    return msg.channel.send("Canal de comandos desativado");
  }

}

export default {
  name: "command",
  aliases: ["cmd", "comando"],
  execute
}