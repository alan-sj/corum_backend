import mongoose, { Document, Types } from 'mongoose';

export interface IAnswer extends Document{
    questionId: Types.ObjectId;
    body: string;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    votes:{
        upvotes: number;
        downvotes: number;
    };
    comments: Types.ObjectId[];
}