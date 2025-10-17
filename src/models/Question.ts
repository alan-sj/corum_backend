import mongoose, { Schema, Model } from "mongoose";
import { type IQuestion } from "../interfaces/questionInterface.js";

const questionSchema: Schema<IQuestion> = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref:"Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    votes: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
    views: { type: Number, default: 0 },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },
    isPrivate: { type: Boolean, default: false },
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> = mongoose.model<IQuestion>(
  "Question",
  questionSchema
);
export default Question;
