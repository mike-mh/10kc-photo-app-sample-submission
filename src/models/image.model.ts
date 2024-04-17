import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IImage extends Document {
  date: number;
  status: number,
  image: string;
  owner: IUser['_id'];
}

const ImageSchema: Schema = new Schema({
  date: { type: Number, required: true },
  status: { type: Number, required: true },
  image: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export default mongoose.model<IImage>('DBImage', ImageSchema);