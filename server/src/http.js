"use strict";
exports.__esModule = true;
exports.createHTTP = void 0;
var http_1 = require("http");
var debug_1 = require("debug");
var config_js_1 = require("./config.js");
var exception_js_1 = require("./models/exception.js");
var dbg = (0, debug_1["default"])("".concat(config_js_1.appName, ":http"));
function getPort(server) {
    var addr = server.address();
    if (!addr)
        return '';
    if (typeof addr === 'string')
        return addr;
    else
        return addr.port.toString();
}
/**
 * Start the HTTP server
 * @param app - Express server to attach to
 * @param onRequest - Event listener for the server
 */
function createHTTP(app) {
    // Create HTTP server
    var server = http_1["default"].createServer(app);
    // let the user know when we're serving
    server.on('listening', function (p) {
        if (p === void 0) { p = getPort(server); }
        return dbg("Listening on http://localhost:".concat(p));
    });
    server.on('error', function (e) {
        if ((e === null || e === void 0 ? void 0 : e.syscall) !== 'listen')
            throw e;
        var p = "Port ".concat(getPort(server));
        var msg = '';
        // handle specific listen errors with friendly messages
        switch (e === null || e === void 0 ? void 0 : e.code) {
            case 'EACCES':
                msg = "".concat(p, " requires elevated privileges");
                break;
            case 'EADDRINUSE':
                msg = "".concat(p, " is already in use");
                break;
            default:
                throw e;
        }
        if (msg)
            throw new exception_js_1.Exception(msg);
    });
    return server;
}
exports.createHTTP = createHTTP;
