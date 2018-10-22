export class Role {

    public static fromResponse(json: any): Role {
        return new Role(
            json.id,
            json.role,
            json.managesUsers
        );
    }
    public readonly id: number;
    public readonly role: string;
    public readonly managesUsers: boolean;

    constructor(id: number, role: string, managesUsers: boolean) {
        this.id = id;
        this.role = role;
        this.managesUsers = managesUsers;
    }

    public clone() {
        return new Role(
            this.id,
            this.role,
            this.managesUsers
        );
    }
}