import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
  guild_id: String,
  prefix: {
    type: String,
    default: "s."
  }
});

export default mongoose.model("Guild", GuildSchema);