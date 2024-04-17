import { OperationProcessor, Operation, HasId, ResourceRelationship, JsonApiErrors, HttpStatusCode, IfUserHasEveryPermission, Authorize, IfUser, IfUserDoesNotHavePermission, UserProcessor } from "kurier";
import VerifiedUser from "../resources/VerifiedUser";
import JsonApiError from "kurier/dist/errors/error";
import AuthenticationService from "../services/AuthenticationService";

export default class VerifiedUserProcessor extends UserProcessor<VerifiedUser> {
    public static resourceClass = VerifiedUser;

    async identify(op: Operation): Promise<HasId | HasId[]> {
        const data = await AuthenticationService.getInstance()
            .getUserInformationFromToken(op.data?.attributes.token as String) as any;

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            verified: data.verified,
        };
    }

    async add(op: Operation): Promise<HasId> {
        if (!op.data?.attributes!.username || !op.data?.attributes!.email || !op.data?.attributes!.password) {
            throw {
                status: HttpStatusCode.BadRequest,
                code: "improperly_formatted_json",
            } as JsonApiError;
        }

        const user = await AuthenticationService.getInstance().createNewPendingUser(
            op.data?.attributes.username as any,
            op.data?.attributes.email as any,
            op.data?.attributes.password as any);

        return user as any;
    }
}