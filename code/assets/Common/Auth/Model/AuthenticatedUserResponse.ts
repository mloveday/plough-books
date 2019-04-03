import {ProfileObj} from "./ProfileObj";
import {TokenObj} from "./TokenObj";

export class AuthenticatedUserResponse {
    public static fromResponse(response: any): AuthenticatedUserResponse {
        return Object.assign(new AuthenticatedUserResponse(), response);
    }
    public accessToken: string;
    public googleId: string;
    public profileObj: ProfileObj;
    public tokenId: string;
    public tokenObj: TokenObj;

    public clone(): AuthenticatedUserResponse {
        return Object.assign(new AuthenticatedUserResponse(), this);
    }
}