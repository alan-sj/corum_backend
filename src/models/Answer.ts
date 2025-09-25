import mongoose, { Document, Schema, Model, Types, mongo } from "mongoose";
import { type IAnswer } from "../interfaces/answerInterface.js";

const answerSchema: Schema<IAnswer> = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    votes: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Answer: Model<IAnswer> = mongoose.model<IAnswer>("Answer", answerSchema);
export default Answer;
