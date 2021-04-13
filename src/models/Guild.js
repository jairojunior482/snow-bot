import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
  guild_id: String,
  prefix: {
    type: String,
    default: "s."
  },
  channels: {
    commands: {
      status: {
        type: Boolean,
        default: false
      },
      channel_id: {
        type: String,
        default: ""
      }
    },
    welcome: {
      status: {
        type: Boolean,
        default: false
      },
      channel_id: {
        type: String,
        default: ""
      },
      message: {
        type: String,
        default: "Sejá bem vindo(a) {member}, ao servidor {server}"
      }
    }
  }
});

export default mongoose.model("Guild", GuildSchema);