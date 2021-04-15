function execute(client, msg, args) {
  const queue = client.queues.get(msg.guild.id);
  if (!queue) {
    return msg.channel.send("Nenhuma música tocando no momento");
  }
  queue.dispatcher.pause();
}

export default {
  name: "pause",
  aliases: ["pausar"],
  execute
}