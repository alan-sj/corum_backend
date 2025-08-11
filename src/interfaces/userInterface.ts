import mongoose, { Document, Types } from 'mongoose';

interface UserProfile {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profile?: UserProfile;
  joinedAt: Date;
  role: 'user' | 'moderator' | 'admin';
  roomMemberships: Types.ObjectId[];
  reputation: number;
  badges: string[];
}
