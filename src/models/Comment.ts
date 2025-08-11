import mongoose, { Document, Types, mongo,Schema,Model } from 'mongoose';
import {IComment} from "../interfaces/commentInterface";

const commentSchema = new Schema<IComment>({
  parentId: { type: Schema.Types.ObjectId, required: true },
  parentType: { type: String, enum: ['question', 'answer'], required: true },
  body: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment:  Model<IComment> =mongoose.model<IComment>('Comment', commentSchema);
export default Comment;