import {Document, Types} from 'mongoose';

export interface IComment extends Document {
  parentId: Types.ObjectId; 
  parentType: 'question' | 'answer';
  body: string;
  author: Types.ObjectId;
  createdAt: Date;
}
