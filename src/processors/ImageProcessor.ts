import { OperationProcessor, Operation, Authorize, IfUserHasPermission, MaybeMeta, HasId } from "kurier";
import Image from "../resources/Image";
import DBImage, { IImage } from "../models/image.model";

export default class ImageProcessor<ResourceT extends Image> extends OperationProcessor<ResourceT> {
    private readonly DEFAULT_TOTAL_RETURNED_IMAGES = 4;
    public static resourceClass = Image;
    
    async get(op: Operation): Promise<HasId[] | HasId> {
        let maxImages = this.DEFAULT_TOTAL_RETURNED_IMAGES;
        let afterCursor = 0;
        let beforeCursor = 0;
        if (!!op.params?.page) {
            if (!!op.params.page.size) {
                maxImages = +op.params.page.size;
            }

            if (!!op.params.page.after) {
                afterCursor = +op.params.page.after;
            }

            if (!!op.params.page.before) {
                beforeCursor = +op.params.page.before;
            }
        }

        if (!!afterCursor) {
            const images = await DBImage.find({
                status: 0, date: {
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
                date: i.date,
                id: i.id
            }));
        }

        if (!!beforeCursor) {
            const images = await DBImage.find({
                status: 0, date: {
                    $lt: beforeCursor
                }
            })
                .populate({ path: 'owner', strictPopulate: false })
                .sort({ date: -1 })
                .limit(maxImages)
                .exec();

            images.sort((a, b) => a.date < b.date ? -1 : 1);

            return images.map(i => ({
                owner: i.owner.username,
                image: i.image,
                status: i.status,
                date: i.date,
                id: i.id
            }));
        }

        const images = await DBImage.find({ status: 0 })
            .populate({ path: 'owner', strictPopulate: false })
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

    async metaForGet(resourceOrResources: Image | Image[]): Promise<MaybeMeta> {
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

        const beforeImage = await DBImage.findOne({ status: 0, date: { $lt: firstImage.attributes.date } }).exec();
        const afterImage = await DBImage.findOne({ status: 0, date: { $gt: lastImage?.attributes.date } }).exec();


        return {
            hasBefore: !!beforeImage,
            hasAfter: !!afterImage
        }
    }

    @Authorize(IfUserHasPermission('verified'))
    async add(op: Operation): Promise<HasId> {

        const image = await DBImage.create({
            owner: op.data?.attributes.owner,
            image: op.data?.attributes.image,
            status: op.data?.attributes.status,
            date: op.data?.attributes.date,
        });

        return {
            id: image.id,
            status: op.data?.attributes.status,
            date: op.data?.attributes.date
        };
    }
}