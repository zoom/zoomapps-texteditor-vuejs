import express from 'express';
import axios from 'axios';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import helmet from 'helmet';
import logger from 'morgan';
import { URL } from 'url';

import { createHTTP } from './http.js';
import signal from './signal.js';

import zoomContext from './middleware/zoom-context.js';
import errorHandler from './middleware/error-handler.js';
import logAxios from './middleware/log-axios.js';

import authRoutes from './routes/auth.js';

import { appName, port, zoomApp } from './config.js';

const dirname = (path: string) => new URL(path, import.meta.url).pathname;
const dbg = debug(`${appName}:app`);

/* App Config */
const app = express();
app.set('port', port);

const redirectHost = new URL(zoomApp.redirectUrl).host;

const publicDir = dirname('public');
const viewDir = dirname('views');

// we use server views to show server errors and prompt installs
app.set('view engine', 'pug');
app.set('views', viewDir);
app.locals.basedir = publicDir;

/*  Middleware */
axios.interceptors.request.use(logAxios.request);
axios.interceptors.response.use(logAxios.response);

const origins = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];

app.use(
    helmet({
        frameguard: {
            action: 'sameorigin',
        },
        hsts: {
            maxAge: 31536000,
        },
        referrerPolicy: {
            policy: 'same-origin',
        },
        contentSecurityPolicy: {
            directives: {
                'default-src': origins,
                styleSrc: origins,
                scriptSrc: origins,
                imgSrc: ["'self'", 'data:', `https://${redirectHost}`],
                'connect-src': ["'self'", `wss://${redirectHost}`],
                'base-uri': 'self',
                'form-action': 'self',
            },
        },
    })
);

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev', { stream: { write: (msg: string) => dbg(msg) } }));

// set up our server routes
app.use('/auth', authRoutes);

// Check each page for a Zoom Context Header
app.use(/\/|\*.html/g, zoomContext());

// handle server errors
app.use(errorHandler());

// serve our vue app
app.use(express.static(publicDir));

// redirect 404s back to index.html
app.get('*', (req, res) => {
    res.sendFile('index.html', { root: publicDir });
});

//start http server
const srvHttp = createHTTP(app);

// start signaling websocket server for webrtc
signal.config(srvHttp);

try {
    await srvHttp.listen(port);
} catch (e: unknown) {
    dbg(e);
    process.exit(1);
}

export default app;
