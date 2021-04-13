import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_id: String,
  vip: {
    has_vip: {
      type: Boolean,
      default: false
    },
    expire_in: {
      type: Number,
      default: 0
    }
  },
});

export default mongoose.model("User", UserSchema);