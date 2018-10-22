import {Role} from "./Role";

export class User {

  public static fromResponse(json: any): User {
    return new User(
      json.id,
      json.email,
      json.whitelisted,
      json.blacklisted,
      Role.fromResponse(json.role)
    );
  }

  public readonly id: number;
  public readonly email: string;
  public readonly whitelisted: boolean;
  public readonly blacklisted: boolean;
  public readonly role: Role;

  constructor(id: number, email: string, whitelisted: boolean, blacklisted: boolean, role: Role) {
    this.id = id;
    this.email = email;
    this.whitelisted = whitelisted;
    this.blacklisted = blacklisted;
    this.role = role;
  }

  public clone() {
    return new User(
      this.id,
      this.email,
      this.whitelisted,
      this.blacklisted,
      this.role
    );
  }
}