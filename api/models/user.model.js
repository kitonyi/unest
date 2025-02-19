import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmedsites.vumc.org%2Fsavonalab%2Fperson%2Fmanasa-bhatta&psig=AOvVaw2OMo4knqQ25BWatfm1g1j7&ust=1740021831856000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLjo98zkzosDFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
