import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  verified: boolean;
  sessions: [{
    sessionId: string,
    expirationDate: number
  }];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true,  unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  sessions: { type: [{
    sessionId: String,
    expirationDate: Number
  }], required: true, default: [] }
});

export default mongoose.model<IUser>('User', UserSchema);