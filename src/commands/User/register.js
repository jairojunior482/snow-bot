import User from "../../models/User";

async function execute(client, msg, args) {
  const user_id = msg.author.id;
  const existsUser = await User.findOne({ user_id });
  if (existsUser) {
    return msg.channel.send("Voçê já está registrado");
  }

  await User.create({
    user_id
  });
  return msg.channel.send("Voçê se registrou com sucesso");
}

export default {
  name: "register",
  execute
}