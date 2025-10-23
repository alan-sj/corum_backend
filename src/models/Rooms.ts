import mongoose, { Schema, Model, Types } from "mongoose";
import { type IRoom } from "../interfaces/roomsInterface.js";
import type { ITextArea } from "../interfaces/textAreaInterface.js";

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const textAreaSchema = new Schema<ITextArea>({
  title: { type: String, required: true },
  body: { type: String, default: "" },
});

const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  inviteCode: { type: String, unique: true, default: generateInviteCode },
  textAreas: [textAreaSchema],
});

const Rooms: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema);
export default Rooms;
