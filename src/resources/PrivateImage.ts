import { Resource, ResourceSchema } from "kurier";
import VerifiedUser from "./VerifiedUser";
import Comment from "./Comment";

enum PictureStatus {
    Public = 0,
    Private
}

export default class PrivateImage extends Resource {
  static get type(): string {
    return "privateimage";
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
    }
  };
}