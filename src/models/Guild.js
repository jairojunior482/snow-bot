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
      id: {
        type: String,
        default: ""
      }
    }
  }
});

export default mongoose.model("Guild", GuildSchema);