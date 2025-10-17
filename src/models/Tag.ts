import mongoose, { Schema, Model } from "mongoose";
import { type ITag } from "../interfaces/tagInterface.js";

const tagSchema = new Schema<ITag>({
  tagName: { type: String, required: true },
});

const Tag: Model<ITag> = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
