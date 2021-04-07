import Discord from "discord.js";
import path from "path";
import fs from "fs";
import "dotenv/config";

import "./database"

import Guild from "./models/Guild";

const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir(path.join(__dirname, "/commands/"), (erro, folders) => {
  if (erro) return;
  folders.forEach(folder => {
    fs.readdir(path.join(__dirname, `/commands/${folder}/`), (erro, files) => {
      if (erro) return;
      const commandsFiles = files.filter(file => file.endsWith(".js"));
      for (let file of commandsFiles) {
        const { default: command } = require(`./commands/${folder}/${file}`);
        if (!command) return;
        client.commands.set(command.name, command);
      }
    });
  });
});

client.on("ready", () => {
  console.log(`(${client.user.username}): Iniciado com sucesso!`);
});

client.on("message", async msg => {
  const guild = await Guild.findOne({ guild_id: msg.guild.id });

  const prefix = guild ? guild.prefix : "s.";

  if (msg.author.bot || msg.channel.type == "dm") return;

  if (msg.content == `<@!${client.user.id}>`) {
    const helloEmbed = new Discord.MessageEmbed()
      .setColor("#0974ed")
      .setAuthor(`${client.user.username}`)
      .setTimestamp()
      .addField("Meu prefix nesse servidor é",
        `\`\`\`js\n${prefix}\n\`\`\``)
      .setFooter(`Requisitado por ${msg.author.username}`);
    return msg.channel.send(helloEmbed);
  }

  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).split(" ");
  const commandName = args.shift().toLowerCase();

  const commands = client.commands;

  const command = commands.get(commandName) ||
    commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command || !command.execute) return;

  try {
    command.execute(client, msg, args);
  } catch (error) {
    return msg.channel.send("Houve um erro tente novamente");
  }
});

const client_token = process.env.CLIENT_TOKEN;
client.login(client_token);