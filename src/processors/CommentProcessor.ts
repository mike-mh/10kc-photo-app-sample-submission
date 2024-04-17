import { OperationProcessor, Operation, HasId, User, ResourceRelationship, JsonApiErrors, Authorize, IfUserHasPermission } from "kurier";
import Comment from "../resources/Comment";
import DBComment, { IComment } from "../models/comment.model";

export default class CommentProcessor<ResourceT extends Comment> extends OperationProcessor<ResourceT> {
    public static resourceClass = Comment;

    @Authorize(IfUserHasPermission('verified'))
    async add(op: Operation): Promise<HasId> {

        const newComment: any = await DBComment.create({
            owner: this.appInstance.user?.id,
            date: op.data?.attributes.date,
            image: op.data?.attributes.imageid,
            comment: op.data?.attributes.comment
        });

        return {
            id: newComment.id,
            comment: newComment.comment,
            owner: newComment.owner
        };
    }

    async get(op: Operation): Promise<HasId | HasId[]> {
        const image = op.params?.filter?.image;

        if (!image) {
            return [] as any;
        }

        const comments = await DBComment.find({ image })
            .populate('owner')
            .exec();

        return comments.map((c: any) => ({
            id: c.id,
            comment: c.comment,
            owner: c.owner.username,
            date: c.date
        })) as any;
    }
}