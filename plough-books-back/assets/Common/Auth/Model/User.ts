import {EditableEntity} from "../../../State/EditableEntity";
import {Role} from "./Role";

export class User extends EditableEntity {

  public static default() {
    return new User('', false, false, Role.default(), undefined);
  }

  public static fromResponse(json: any): User {
    return new User(json.email, json.whitelisted, json.blacklisted, Role.fromResponse(json.role), json.id);
  }

  public readonly email: string;
  public readonly whitelisted: boolean;
  public readonly blacklisted: boolean;
  public readonly role: Role;
  private readonly id?: number;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: Role, id?: number) {
    super();
    this.id = id;
    this.email = email;
    this.whitelisted = whitelisted;
    this.blacklisted = blacklisted;
    this.role = role;
  }

  public with(obj: any) {
    return Object.assign(User.default(), this, obj);
  }

  public get entityId(): number {
    return this.id ? this.id : -1;
  }
}