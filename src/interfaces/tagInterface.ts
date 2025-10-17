import { Document } from "mongoose";

export interface ITag extends Document {
  tagName: string;
}
