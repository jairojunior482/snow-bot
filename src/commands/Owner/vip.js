import moment from "moment";
import ms from "ms";

moment.locale("pt-br");

import User from "../../models/User";

async function execute(client, msg, args) {
  const subCommand = args[0];
  const owner_id = "473503855766667264";
  if (msg.author.id != owner_id) {
    return msg.channel.send("Esse comando é privado");
  }

  if (["set", "add"].includes(subCommand) && msg.author.id == owner_id) {
    const mentionUser = msg.mentions.members.first() ||
      client.users.cache.get(args[1]);
    if (!mentionUser) {
      return msg.channel.send("Voçê precisa mencionar/digitar id do usuário");
    }

    if (mentionUser.bot || mentionUser.user.bot) {
      return msg.channel.send("Não é possivel adicionar vip em um bot");
    }

    const expireTimer = ms(args[2]);

    if (!expireTimer) {
      return msg.channel.send("Voçễ precisa adicionar um tempo");
    }

    if (isNaN(expireTimer)) {
      return msg.channel.send("Tempo inválido");
    }

    const user = await User.findOne({ user_id: mentionUser.user.id });

    if (!user) {
      return msg.channel.send("Esse usuário não esta registrado no sistema");
    }

    if (user.vip.has_vip) {
      await User.findOneAndUpdate({ user_id: mentionUser.user.id }, {
        $set: {
          "vip.expire_in": user.vip.expire_in + Date.now() + expireTimer
        }
      });
      return msg.channel
        .send("O usuário já tem vip portando adicionei mais tempo");
    }

    await User.findOneAndUpdate({ user_id: mentionUser.user.id }, {
      $set: {
        "vip.has_vip": true,
        "vip.expire_in": Date.now() + expireTimer
      }
    });
    return msg.channel.send(`Foi adicionado vip para ${mentionUser} `);
  }
}

export default {
  name: "vip",
  execute
}