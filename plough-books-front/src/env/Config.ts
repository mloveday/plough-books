let backendDomain;
let devDebugEnabled = false;

switch (process.env.environment) {
    case 'production':
        backendDomain = 'https://dashboard.theploughharborne.co.uk';
        break;
    case 'remote-dev':
        backendDomain = 'https://plough-dash.duckdns.org';
        break;
    case 'dev':
    default:
        backendDomain = 'http://localhost:8000';
        devDebugEnabled = true;
}

export const backendApiDomain = backendDomain;
export const tokenQueryParam = (token: any) => (devDebugEnabled ? '?XDEBUG_SESSION_START=ploughdash&token=' : '?token=') + token;