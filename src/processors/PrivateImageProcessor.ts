import { OperationProcessor, Operation, Authorize, IfUserHasPermission, MaybeMeta, HasId } from "kurier";
import Image from "../resources/Image";
import DBImage, { IImage } from "../models/image.model";
import PrivateImage from "../resources/PrivateImage";

export default class PrivateImageProcessor<ResourceT extends PrivateImage> extends OperationProcessor<ResourceT> {
    public static resourceClass = PrivateImage;

    private readonly DEFAULT_TOTAL_RETURNED_IMAGES = 4;

    async metaForGet(resourceOrResources: PrivateImage | PrivateImage[]): Promise<MaybeMeta> {
        const images = resourceOrResources as [Image];
        if (!images) return;

        if (!images.length) {
            return {
                hasBefore: false,
                hasAfter: false
            }
        }

        const firstImage = images[0];
        const lastImage = images.slice(-1).pop();

        const beforeImage = await DBImage.findOne({ owner: this.appInstance.user?.id, date: { $lt: firstImage.attributes.date } }).exec();
        const afterImage = await DBImage.findOne({ owner: this.appInstance.user?.id, date: { $gt: lastImage?.attributes.date } }).exec();


        return {
            hasBefore: !!beforeImage,
            hasAfter: !!afterImage
        }
    }


    @Authorize(IfUserHasPermission('verified'))
    async get(op: Operation): Promise<HasId[] | HasId> {
        let maxImages = this.DEFAULT_TOTAL_RETURNED_IMAGES;
        let afterCursor = 0;
        let beforeCursor = 0;
        if (!!op.params?.page) {
            if(!!op.params.page.size) {
                maxImages = +op.params.page.size;
            }

            if(!!op.params.page.after) {
                afterCursor = +op.params.page.after;
            }

            if(!!op.params.page.before) {
                beforeCursor = +op.params.page.before;
            }
        }

        if (!!afterCursor) {
            const images = await DBImage.find({
                owner: this.appInstance.user?.id, date: {
                    $gt: afterCursor
                }
            })
                .populate({ path: 'owner', strictPopulate: false })
                .limit(maxImages)
                .exec();

            return images.map(i => ({
                owner: i.owner.username,
                image: i.image,
                status: i.status,
                date: i.date
            })) as any;
        }

        if (!!beforeCursor) {
            const images = await DBImage.find({
                owner: this.appInstance.user?.id, date: {
                    $lt: beforeCursor
                }
            })
                .sort({ date: -1 })
                .limit(maxImages)
                .exec();

                images.sort((a, b) => a.date < b.date ? -1: 1);

            return images.map(i => ({
                owner: i.owner.username,
                image: i.image,
                status: i.status,
                date: i.date
            })) as any;
        }


        const images = await DBImage.find({ owner: this.appInstance.user?.id })
            .limit(maxImages)
            .exec();

        return images.map(i => ({
            owner: i.owner.username,
            image: i.image,
            status: i.status,
            date: i.date,
            id: i.id
        }));
    }

    @Authorize(IfUserHasPermission('verified'))
    async remove(op: Operation): Promise<void> {
        await DBImage.deleteOne({
            owner: this.appInstance.user?.id,
            _id: op.ref.id
        })
            .exec();
    }
}