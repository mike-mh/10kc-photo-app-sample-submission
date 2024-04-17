import { Resource, ResourceSchema } from "kurier";
import VerifiedUser from "./VerifiedUser";

export default class Comment extends Resource {
  static get type(): string {
    return "comment";
  }

  static schema: ResourceSchema = {
    attributes: {
      owner: String,
      imgid: String,
      comment: String,
      date: Number,
    },
    relationships: {
        user: {
            type: () => VerifiedUser,
            belongsTo: true,
            foreignKeyName: "id"
        }
    }
  };
}