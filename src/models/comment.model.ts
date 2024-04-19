import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IImage } from './image.model';

export interface IComment extends Document {
  date: number;
  comment: string;
  owner: IUser['_id'];
  image: IImage['_id'];
}

const CommentSchema: Schema = new Schema({
  date: { type: Number, required: true },
  comment: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  image: { type: Schema.Types.ObjectId, required: true, ref: 'DBImage' }
});

export default mongoose.model<IComment>('DBComment', CommentSchema);