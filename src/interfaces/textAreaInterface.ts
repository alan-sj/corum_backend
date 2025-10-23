import { Document } from "mongoose";

export interface ITextArea extends Document {
  title: string;
  body: string;
}
