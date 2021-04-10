import { MessageEmbed } from "discord.js";

function execute(client, msg, args) {
  const pingEmbed = new MessageEmbed()
    .setColor("#0974ed")
    .setAuthor(`${client.user.username}`, client.user.avatarURL())
    .addField("**Meu ping**", `\`${client.ws.ping} ms\``)
    .setTimestamp();
  return msg.channel.send(pingEmbed);
}

export default {
  name: "ping",
  aliases: ["pong"],
  execute
}