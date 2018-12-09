import {backendApiDomain, tokenQueryParam} from "../../env/Config";
import {getAuthTokenFromLocalStorage} from "../State/AuthStorage";

export function authenticatedFetch(url: string, onAuthError: () => void, init?: RequestInit): Promise<any> {
    url = '/api' + url;
    return fetch(authenticatedUrl(url), init)
        .then(r => {
            if (r.ok) {
                return r.json();
            } else {
                if (r.status === 401) {
                    onAuthError();
                    return r.text().then(reason => {
                        throw new Error('Not Authorised: ' + reason);
                    });
                } else {
                    throw new Error(`Error fetching data from URL (/api${url}) with response code (${r.status})`);
                }
            }
        });
}

export function authenticatedUrl(url: string) {
    try {
        return backendApiDomain + url + tokenQueryParam(getAuthTokenFromLocalStorage());
    } catch (e) {
        throw new Error("Not signed in, will not fetch data");
    }
}