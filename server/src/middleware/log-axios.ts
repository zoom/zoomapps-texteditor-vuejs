import { AxiosRequestConfig, AxiosResponse } from 'axios';
import debug from 'debug';
import { URL } from 'url';
import { appName } from '../config.js';

const dbg = debug(`${appName}:axios`);
const isProd = process.env.NODE_ENV === 'production';

type AxiosInterceptor<T> = (r: T) => T;
type AxiosLogger = {
    response?: AxiosInterceptor<AxiosResponse>;
    request?: AxiosInterceptor<AxiosRequestConfig>;
};

const printLog = (
    method: string | undefined,
    path: string | undefined,
    baseURL: string | undefined,
    status?: number
) => {
    let msg = method ? `${method.toUpperCase()} ` : '';

    if (status) msg = `${status.toString()} ${msg} `;

    if (path && baseURL) msg += new URL(path, baseURL).href;
    else if (baseURL) msg += baseURL;

    dbg(msg);
};

const logger: AxiosLogger = {
    response: (r) => {
        if (isProd) return r;

        const {
            status,
            config: { method, url, baseURL },
        } = r;

        printLog(method, url, baseURL, status);

        return r;
    },
    request: (r) => {
        if (isProd) return r;

        const { method, url, baseURL } = r;

        printLog(method, url, baseURL);

        return r;
    },
};

export default logger;
