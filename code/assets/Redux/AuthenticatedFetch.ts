// @ts-ignore
import {backendApiDomain} from "env/Config";

export function authenticatedFetch(url: string, onAuthError: () => void, init?: RequestInit): Promise<any> {
    const prefixedUrl = '/api' + url;
    return fetch(backendApiDomain + prefixedUrl, init)
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
                    throw new Error(`Error fetching data from URL (${prefixedUrl}) with response code (${r.status})`);
                }
            }
        });
}