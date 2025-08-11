import {Document,Types} from 'mongoose';

export interface IRoom extends Document{
    name:string;
    description:string,
    createdBy: Types.ObjectId;
    createdAt: Date,
    isPrivate: Boolean,
    inviteCode: string,
    members:Types.ObjectId[],
    resources:{
        sharedFiles:string[];
        pinnedQuestions:Types.ObjectId[];
    }
}