import {UserApiType} from "../../../DataEntry/User/State/UserTypes";
import {Domain, IDomainApiObject} from "./Domain";
import {User} from "./User";

export interface IUserManagementApiObject {
    users: UserApiType[];
    domains: IDomainApiObject[];
}

export class UserManagementResponse {
    public static fromResponse(json: IUserManagementApiObject): UserManagementResponse {
        return new UserManagementResponse(
          json.users.map(user => User.fromResponse(user)),
          json.domains.map(domain => Domain.fromResponse(domain))
        );
    }
    public readonly users: User[];
    public readonly domains: Domain[];

    constructor(users: User[], domains: Domain[]) {
        this.users = users;
        this.domains = domains;
    }
}