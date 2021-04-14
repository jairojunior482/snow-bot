import { Client, Message ,MessageEmbed } from "discord.js";

import Guild from "../../models/Guild";

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 * @returns 
 */

async function execute(client, msg, args) {
  const hasPermission = msg.member.permissions.has("ADMINISTRATOR");
  if (!hasPermission) return;
  const subCommand = args[0];
  const guild_id = msg.guild.id;
  const guild = await Guild.findOne({ guild_id });

  const channelInfo = client.channels.cache.get(guild.channels.welcome.channel_id);

  if (!subCommand || subCommand == "info") {
    if (!channelInfo) {
      return msg.channel.send("Nenhum canal setado");
    }
    const channelInfoEmbed = new MessageEmbed()
      .setColor("#0974ed")
      .setDescription("Informações sobre o canal")
      .setAuthor(client.user.username, client.user.avatarURL())
      .addFields(
        {
          name: "Canal",
          value: `<#${channelInfo.id}>`
        },
        {
          name: "Messagem",
          value: `\`\`\`${guild.channels.welcome.message}\`\`\``
        },
        {
          name: "Status",
          value: `\`\`\`${guild.channels.welcome.status ? "ativado" : "desativado"}\`\`\``
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
        "channels.welcome.channel_id": mentionChannel.id
      }
    });
    return msg.channel.send(`${mentionChannel.name} Setado com sucesso`);
  }

  if (subCommand == "on") {
    if (guild.channels.welcome.status) {
      return msg.channel.send("Canal já esta ativado");
    }
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.welcome.status": true
      }
    });
    return msg.channel.send("Canal de comandos ativado");
  }

  if (subCommand == "off") {
    if (!guild.channels.welcome.status) {
      return msg.channel.send("Canal já esta desativado");
    }
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.welcome.status": false
      }
    });
    return msg.channel.send("Canal de comandos desativado");
  }

  if (subCommand == "msg") {
    const welcomeMessage = args.join(" ").slice(args[0].length + 1);
    await Guild.findOneAndUpdate({ guild_id }, {
      $set: {
        "channels.welcome.message": welcomeMessage
      }
    });
    return msg.channel.send("Message de welcome alterada com sucesso");
  }

  if (subCommand == "test") {
    const welcomeEmbed = new MessageEmbed()
      .setColor("#0974ed")
      .setAuthor(client.user.username, client.user.avatarURL())
      .setTitle("Bem-vindo(a)")
      .setTimestamp();
    const guildName = msg.guild.name;
    const memberName = msg.author.username;
    const welcomeMessage = guild.channels.welcome.message
      .replace(/{member}/g, memberName)
      .replace(/{server}/g, guildName).split(",");
      welcomeMessage.forEach(message => {
      welcomeEmbed.addField(message, "\u200b");
    })
    const welcomeChannel = client.channels.cache
      .get(guild.channels.welcome.channel_id);
    return welcomeChannel.send(welcomeEmbed);
  }

}

export default {
  name: "welcome",
  aliases: ["bem-vindo"],
  execute
}