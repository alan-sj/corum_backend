import { Document, Types } from "mongoose";
import type { ITextArea } from "./textAreaInterface.js";

export interface IRoom extends Document {
  name: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  isPrivate: Boolean;
  inviteCode: string;
  members: Types.ObjectId[];
  textAreas: ITextArea[];
}
