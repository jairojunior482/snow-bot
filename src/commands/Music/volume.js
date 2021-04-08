function execute(client, msg, args) {
  const volume = args[0];
  const queue = client.queues.get(msg.guild.id);
  if (!queue) {
    return msg.channel.send("Nenhuma música tocando no momento");
  }
  if (Number(volume) > 10) {
    queue.volume = 1;
  }

  queue.volume = volume;
  queue.dispatcher.setVolume(volume / 10);
  client.queues.set(msg.guild.id, queue);
}

export default {
  name: "volume",
  execute
}