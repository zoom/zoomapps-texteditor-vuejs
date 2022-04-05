import http from 'http';
import debug from 'debug';
import { appName } from './config.js';
import { Exception } from './models/exception.js';

const dbg = debug(`${appName}:http`);

/**
 * Start the HTTP server
 * @param app - Express server to attach to
 * @param {String|number} port - local TCP port to serve from
 */
export async function start(app: Express.Application, port: number | string) {
    // Create HTTP server
    const server = http.createServer(app);

    // let the user know when we're serving
    server.on('listening', () => {
        const addr = server.address();
        if (addr === null) return;

        const bind =
            typeof addr === 'string'
                ? `pipe ${addr}`
                : `http://localhost:${addr.port}`;

        dbg(`Listening on ${bind}`);
    });

    server.on('error', (e: Exception) => {
        if (e?.syscall !== 'listen') throw e;

        const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (e?.code) {
            case 'EACCES':
                throw new Exception(`${bind} requires elevated privileges`);
            case 'EADDRINUSE':
                throw new Exception(`${bind} is already in use`);
            default:
                throw e;
        }
    });

    // Listen on provided port, on all network interfaces
    return server.listen(port);
}
