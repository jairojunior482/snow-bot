import { Client, Message, MessageEmbed } from "discord.js";

import ytSearch from "yt-search";
import ytdl from "ytdl-core-discord";

/**
 * @param {Client} client 
 * @param {Message} msg 
 * @param {String} args 
 * @returns 
 */

function execute(client, msg, args) {
  const hasRole = msg.member.roles.cache.has("830430436236197909")
  if (!hasRole) {
    return msg.channel.send("Voçê precisa do cargo de dj");
  }
  const voiceChannel = msg.member.voice.channel;
  const musicName = args.join("");
  const erroEmbed = new MessageEmbed()
    .setColor("#0974ed")
    .setTitle(":x: Erro")
    .setTimestamp()

  if (!voiceChannel) {
    erroEmbed.addField("Voçê precisa está em um canal de voz",
      "\`\`\`Tente novamente\`\`\`")
    return msg.channel.send(erroEmbed);
  }

  if (!musicName) {
    erroEmbed.addField("Voçê precisa digitar um nome de uma música",
      "\`\`\`Tente novamente\`\`\`")
    return msg.channel.send(erroEmbed);
  }

  ytSearch(musicName, async (erro, result) => {
    const music = result.videos[0];
    if (erro) {
      return msg.channel.send("Houve um erro tente novamenete");
    }

    if (!result.videos.length) {
      erroEmbed.addField("Não consegui encontrar essa música",
        "\`\`\`Tente novamente\`\`\`");
      return msg.channel.send(erroEmbed);
    }

    const queue = client.queues.get(msg.guild.id);

    if (queue) {
      queue.songs.push(music);
      const queueEmebd = new MessageEmbed()
        .setColor("#0974ed")
        .setTitle(":white_check_mark: Fila")
        .addField("Fila atualizada",
          `\`\`\`${music.title} \nFoi adicionda a fila\`\`\``)
        .setTimestamp();
      client.queues.set(msg.guild.id, queue);
      return msg.channel.send(queueEmebd);
    }
    return playSong(client, msg, music);
  });
}

/**
 * 
 * @param {Client} client 
 * @param {Message} msg 
 */

async function playSong(client, msg, music) {
  let queue = client.queues.get(msg.guild.id);
  if (!music) {
    if (queue) {
      queue.connection.disconnect();
      return client.queues.delete(msg.guild.id);
    }
  }
  if (!queue) {
    queue = {
      volume: 1,
      dispatcher: null,
      connection: await msg.member.voice.channel.join(),
      songs: [music]
    }
  }
  queue.dispatcher = await queue.connection.play(await ytdl(music.url,
    { highWaterMark: 1 << 25, filter: "audioonly" }), { type: "opus" });

  queue.dispatcher.setVolume(queue.volume / 10);
  queue.dispatcher.on("finish", async () => {
    queue.songs.shift();
    client.queues.set(msg.guild.id, queue);
    playSong(client, msg, queue.songs[0]);
  });
  client.queues.set(msg.guild.id, queue);
  const sucessEmbed = new MessageEmbed()
    .setColor("#0974ed")
    .setAuthor(`${client.user.username}`, client.user.avatarURL())
    .addField("**Tocando** :musical_note:",
      `\`\`\`${music.title}\`\`\``)
    .setFooter(`Requisitado por ${msg.author.username}`)
    .setTimestamp();
  return msg.channel.send(sucessEmbed);
}

export default {
  name: "play",
  aliases: ["tocar"],
  execute
}