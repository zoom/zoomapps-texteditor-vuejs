import { Application } from 'express';
import http from 'http';
import debug from 'debug';
import { appName } from './config.js';

import { Exception } from './models/exception.js';

const dbg = debug(`${appName}:http`);

function getPort(server: http.Server): string {
    const addr = server.address();

    if (!addr) return '';

    if (typeof addr === 'string') return addr;
    else return addr.port.toString();
}

/**
 * Start the HTTP server
 * @param app - Express server to attach to
 * @param onRequest - Event listener for the server
 */
export function createHTTP(app: Application) {
    // Create HTTP server
    const server = http.createServer(app);

    // let the user know when we're serving
    server.on('listening', (p = getPort(server)) =>
        dbg(`Listening on http://localhost:${p}`)
    );

    server.on('error', (e: Exception) => {
        if (e?.syscall !== 'listen') throw e;

        const p = `Port ${getPort(server)}`;
        let msg = '';

        // handle specific listen errors with friendly messages
        switch (e?.code) {
            case 'EACCES':
                msg = `${p} requires elevated privileges`;
                break;
            case 'EADDRINUSE':
                msg = `${p} is already in use`;
                break;
            default:
                throw e;
        }

        if (msg) throw new Exception(msg);
    });

    return server;
}
