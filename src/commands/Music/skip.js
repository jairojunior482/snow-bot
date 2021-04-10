function execute(client, msg, args) {
  const queue = client.queues.get(msg.guild.id);
  if (!queue) {
    return msg.channel.send("Nenhuma música tocando no momento");
  }
  queue.dispatcher.end();
}

export default {
  name: "skip",
  aliases: ["pular"],
  execute
}