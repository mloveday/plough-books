import {User} from "../../../Model/User/User";
import {UserApiType} from "../../../Model/User/UserTypes";
import {Domain, IDomainApiObject} from "./Domain";

export interface IUserManagementApiObject {
    users: UserApiType[];
    domains: IDomainApiObject[];
}

export class UserManagementResponse {
    public static fromApi(json: IUserManagementApiObject): UserManagementResponse {
        return new UserManagementResponse(
          json.users.map(user => User.fromApi(user)),
          json.domains.map(domain => Domain.fromApi(domain))
        );
    }
    public readonly users: User[];
    public readonly domains: Domain[];

    constructor(users: User[], domains: Domain[]) {
        this.users = users;
        this.domains = domains;
    }
}