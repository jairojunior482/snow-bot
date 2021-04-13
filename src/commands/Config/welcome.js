import { MessageEmbed } from "discord.js";

import Guild from "../../models/Guild";

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

}

export default {
  name: "welcome",
  aliases: ["bem-vindo"],
  execute
}