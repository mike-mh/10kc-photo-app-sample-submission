import { Resource, ResourceSchema, User as JsonApiUser, Password } from "kurier";
import JsonApiError from "kurier/dist/errors/error";
import Image from './Image';
import Comment from './Comment';

export default class VerifiedUser extends JsonApiUser {
    static get type(): string {
        return "user";
    }

    static schema: ResourceSchema = {
        attributes: {
            username: String,
            email: String,
            verified: Boolean,
            password: Password
        },
        relationships: {
            images: {
                type: () => Image,
                hasMany: true
            },
            comments: {
                type: () => Comment,
                hasMany: true
            }
        }
    };
}