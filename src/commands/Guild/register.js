import Guild from "../../models/Guild";

async function execute(client, msg, args) {
  const guild_id = msg.guild.id;
  const existsGuild = await Guild.findOne({ guild_id });
  if (existsGuild) {
    return msg.channel.send("Guilda já registrada");
  }

  await Guild.create({ guild_id });
  return msg.channel.send("Guilds registrada com sucesso");
}

export default {
  name: "guild",
  execute
}