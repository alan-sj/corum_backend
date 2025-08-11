import {Document,Types} from 'mongoose';

export interface IQuestion extends Document {
  title: string;
  body: string;
  tags: string[];
  author: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  views: number;
  answers: Types.ObjectId[];   
  comments: Types.ObjectId[];  
  acceptedAnswer?: Types.ObjectId; 
  isPrivate: boolean;
  roomId?: Types.ObjectId; 
}
