export interface IDomainApiObject {
    emailDomain: string;
    whitelisted: boolean;
    blacklisted: boolean;
}

export class Domain {

    public static fromApi(json: IDomainApiObject): Domain {
        return new Domain(
            json.emailDomain,
            json.whitelisted,
            json.blacklisted
        );
    }
    public readonly domain: string;
    public readonly whitelisted: boolean;
    public readonly blacklisted: boolean;

    constructor(domain: string, whitelisted: boolean, blacklisted: boolean) {
        this.domain = domain;
        this.whitelisted = whitelisted;
        this.blacklisted = blacklisted;
    }

    public clone(): Domain {
        return new Domain(
            this.domain,
            this.whitelisted,
            this.blacklisted
        );
    }
}