import {Domain} from "./Domain";
import {User} from "./User";

export class UserManagementResponse {
    public static fromResponse(json: any): UserManagementResponse {
        return new UserManagementResponse(
          json.users.map((user: any) => User.fromResponse(user)),
          json.domains.map((domain: any) => Domain.fromResponse(domain))
        );
    }
    public readonly users: User[];
    public readonly domains: Domain[];

    constructor(users: User[], domains: Domain[]) {
        this.users = users;
        this.domains = domains;
    }
}