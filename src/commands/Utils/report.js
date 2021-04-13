import { Client, Message, MessageEmbed } from "discord.js";

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String[]} args 
 */

function execute(client, msg, args) {
  const reportedBy = msg.author.username;
  const report = args.join("");
  const reportChannel = client.guilds.cache.get("829368970858725456")
    .channels.cache.get("831324936944615444");
  const reportEmbed = new MessageEmbed()
    .setColor("#0974ed")
    .setTitle("New Report")
    .addFields(
      { name: "Reportado por", value: `\`\`\`${reportedBy}\`\`\`` },
      { name: "Report", value: `\`\`\`${report}\`\`\`` },
    )
    .setTimestamp();
  msg.channel.send("Report enviado com sucesso");
  return reportChannel.send(reportEmbed);
}

export default {
  name: "report",
  aliases: ["reportar"],
  execute
}