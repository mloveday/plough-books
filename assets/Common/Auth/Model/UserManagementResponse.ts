import {Domain, IDomainApiObject} from "./Domain";
import {IUserApiObject, User} from "./User";

export interface IUserManagementApiObject {
    users: IUserApiObject[];
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