import { Resource, ResourceSchema } from "kurier";
import VerifiedUser from "./VerifiedUser";
import Comment from "./Comment";

enum PictureStatus {
    Public = 0,
    Private
}

export default class Image extends Resource {
  static get type(): string {
    return "image";
  }

  static schema: ResourceSchema = {
    attributes: {
      owner: String,
      image: String,
      date: Number,
      status: Number
    },
    relationships: {
      user: {
        type: () => VerifiedUser,
        belongsTo: true
      },
      comments: {
        type: () => Comment,
        hasMany: true
      }
    }
  };
}