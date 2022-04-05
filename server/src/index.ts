import express, { NextFunction, Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import db from './db.js';
import debug from 'debug';
import helmet, { HelmetOptions } from 'helmet';
import logger from 'morgan';
import session from 'express-session';
import { URL } from 'url';

import { start } from './http.js';
import { Exception } from './models/exception.js';
import homeRoutes from './routes/home.js';
import authRoutes from './routes/auth.js';

import {
    appName,
    mongoURL,
    port,
    redirectUri,
    sessionSecret,
} from './config.js';

declare module 'express-session' {
    interface Session {
        userId: string;
        meetingUUID: string;
    }
}

const dirname = (path: string) => new URL(path, import.meta.url).pathname;

// connect to MongoDB
await db.connect(mongoURL);

/* App Config */
const app = express();
const dbg = debug(`${appName}:app`);

// CSP directives
const redirectHost = new URL(redirectUri).host;

// views and assets
const appDir = dirname('app');
const viewDir = dirname('server/views');

app.set('view engine', 'pug');
app.set('views', viewDir);
app.locals.basedir = appDir;

// HTTP
app.set('port', port);

axios.interceptors.request.use((r: AxiosRequestConfig) => {
    if (process.env.NODE_ENV === 'production') return;

    const { method, url, baseURL } = r;

    let msg = method;

    if (url && baseURL) msg += new URL(url, baseURL).href;

    debug(`${appName}:axios`)(msg);

    return r;
});

axios.interceptors.response.use((r: AxiosResponse) => {
    if (process.env.NODE_ENV === 'production') return;

    const {
        status,
        config: { url, baseURL },
    } = r;

    let msg = status.toString();

    if (url) msg += new URL(url, baseURL).href;
    else msg += baseURL;

    debug(`${appName}:axios`)(msg);

    return r;
});

/*  Middleware */

const headers: Readonly<HelmetOptions> = {
    frameguard: {
        action: 'sameorigin',
    },
    hsts: {
        maxAge: 31536000,
    },
    referrerPolicy: {
        policy: 'sameorigin',
    },
    contentSecurityPolicy: {
        directives: {
            'default-src': 'self',
            styleSrc: 'self',
            scriptSrc: 'self',
            imgSrc: ["'self'", `https://${redirectHost}`],
            'connect-src': 'self',
            'base-uri': 'self',
            'form-action': 'self',
        },
    },
};

app.use(helmet(headers));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev', { stream: { write: (msg) => dbg(msg) } }));

// serve our app folder
app.use(express.static(appDir));

app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: true,
            maxAge: 365 * 24 * 60 * 60 * 1000,
        },
        store: db.createStore(),
    })
);

/* Routing */
app.use('/', homeRoutes);
app.use('/auth', authRoutes);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Exception, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const title = `Error ${err.status}`;

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (res.locals.error) dbg(`${title} %s`, err.stack);

    // render the error page
    res.status(status);
    res.render('error');
});

// redirect users to the home page if they get a 404 route
app.get('*', (req, res) => res.redirect('/'));

// start serving
start(app, port).catch(async (e: Error) => {
    console.error(e);
    await db.disconnect();
    process.exit(1);
});

export default app;
