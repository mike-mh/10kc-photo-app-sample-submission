import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IValidationToken extends Document {
    validationToken: string;
    expirationDate: number;
    owner: IUser['_id'];
  }

const ValidationTokenSchema = new Schema({
    validationToken: {type: String, required: true, unique: true},
    expirationDate: {type: Number, required: true},
    owner: { type: Schema.Types.ObjectId, required: true },
});

export default mongoose.model<IValidationToken>('ValidationToken', ValidationTokenSchema);
