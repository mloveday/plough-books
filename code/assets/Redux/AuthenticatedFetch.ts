// @ts-ignore
import {backendApiDomain, tokenQueryParam} from "env/Config";
import {getAuthTokenFromLocalStorage} from "./Auth/AuthStorage";

export function authenticatedFetch(url: string, onAuthError: () => void, body?: any, method: string = 'GET'): Promise<any> {
    const prefixedUrl = '/api' + url + tokenQueryParam('');
    return fetch(prefixedUrl, authenticatedInit(method, body))
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

function authenticatedInit(method: string, body?: any): RequestInit {
    return {
        body,
        headers: {
            ['content-type']: 'application/json',
            ['Auth']: `Bearer ${getAuthTokenFromLocalStorage()}`,
        },
        method,
    }
}