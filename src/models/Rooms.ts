import mongoose, { Document, Schema, Model, Types } from "mongoose";
import Question from "./Question.js";
import { type IRoom } from "../interfaces/roomsInterface.js";

const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPrivate: { type: Boolean, required: true },
  inviteCode: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  resources: {
    sharedFiles: [{ type: String }],
    pinnedQuestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
});

const Rooms: Model<IRoom> = mongoose.model<IRoom>("Room", roomSchema);
export default Rooms;
