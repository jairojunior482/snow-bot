function execute(client, msg, args) {
  const queue = client.queues.get(msg.guild.id);
  if (!queue) {
    return msg.channel.send("Nenhuma música tocando no momento");
  }
  queue.dispatcher.destroy();
  queue.connection.disconnect();
  return client.queues.delete(msg.guild.id);
}

export default {
  name: "stop",
  aliases: ["parar"],
  execute
}