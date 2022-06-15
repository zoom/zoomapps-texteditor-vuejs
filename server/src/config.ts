import { URL } from 'url';
import debug from 'debug';
import dotenv from 'dotenv';

const dirname = (path: string) => new URL(path, import.meta.url).pathname;

const config =
    process.env.NODE_ENV === 'production'
        ? process.env
        : dotenv.config({ path: dirname('../.env') })?.parsed || process.env;

const deps = [
    'ZM_CLIENT_ID',
    'ZM_CLIENT_SECRET',
    'ZM_REDIRECT_URL',
    'SESSION_SECRET',
];

// Check that we have all our config dependencies
let hasMissing = !config;
for (const dep in deps) {
    const conf = deps[dep];
    const str = config[conf];

    if (!str) {
        console.error(`${conf} is required`);
        hasMissing = true;
    }
}

if (hasMissing) throw new Error('Missing required .env values...exiting');

export const zoomApp = {
    host: config.ZM_HOST || 'https://zoom.us',
    clientId: config.ZM_CLIENT_ID as string,
    clientSecret: config.ZM_CLIENT_SECRET as string,
    redirectUrl: config.ZM_REDIRECT_URL as string,
    sessionSecret: config.SESSION_SECRET as string,
};

export const appName = config.APP_NAME || 'zoom-app';
export const redirectUrl = zoomApp.redirectUrl as string;
export const port = config.PORT || '3000';

const dbg = debug(`${config.APP_NAME}:config`);

try {
    new URL(config.ZM_REDIRECT_URL as string);
} catch (e) {
    if (!(e instanceof Error)) dbg(e);
    else throw e;
}

// require secrets are explicitly imported
export default {
    appName,
    redirectUrl,
    port,
};
