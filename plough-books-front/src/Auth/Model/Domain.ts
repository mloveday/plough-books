export class Domain {

    public static fromResponse(json: any): Domain {
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