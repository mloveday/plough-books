export class Role {

  public static default() {
    return new Role('', false, undefined);
  }

  public static fromResponse(json: any): Role {
    return new Role(json.role, json.managesUsers, json.id);
  }

  public readonly role: string;
  public readonly managesUsers: boolean;
  private readonly id?: number;

  constructor(role: string, managesUsers: boolean, id?: number) {
    this.id = id;
    this.role = role;
    this.managesUsers = managesUsers;
  }

  get roleId(): number {
    return this.id ? this.id : -1;
  }

  public clone() {
    return new Role(this.role, this.managesUsers, this.id);
  }

  public with(obj: any) {
    return Object.assign(Role.default(), this, obj);
  }
}