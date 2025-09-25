import mongoose, { Document, Schema, Model } from "mongoose";
import { type IUser } from "../interfaces/userInterface.js";

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profile: {
    name: String,
    bio: String,
    avatarUrl: String,
  },
  joinedAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["user", "moderator", "admin"],
    default: "user",
  },
  roomMemberships: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  reputation: { type: Number, default: 0 },
  badges: [String],
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
