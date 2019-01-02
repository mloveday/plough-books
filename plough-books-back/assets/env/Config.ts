let backendDomain = 'https://dashboard.theploughharborne.co.uk';
let devDebugEnabled = false;

switch (process.env.environment) {
    case 'production':
        break;
    case 'dev':
        backendDomain = 'http://localhost:8000';
        devDebugEnabled = true;
        break;
    default:
        break;
}

export const backendApiDomain = backendDomain;
export const tokenQueryParam = (token: any) => (devDebugEnabled ? '?XDEBUG_SESSION_START=ploughdash&token=' : '?token=') + token;