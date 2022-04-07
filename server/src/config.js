"use strict";
exports.__esModule = true;
exports.port = exports.signingKey = exports.encryptionKey = exports.mongoURL = exports.sessionSecret = exports.redirectUri = exports.appName = exports.zoomApp = void 0;
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var dotenv_expand_1 = require("dotenv-expand");
// Read .env directly to avoid adding secrets to the environment
var fileName = '.env';
var filePath = new URL(fileName, import.meta.url).pathname;
if (!fs_1["default"].existsSync(filePath))
    throw new Error("config file ".concat(filePath, " does not exist"));
var buf;
try {
    buf = fs_1["default"].readFileSync(filePath);
}
catch (e) {
    console.error('failed to read config: ', e);
    process.exit(1);
}
// Replace MongoDB connection string templates
var config = dotenv_expand_1["default"].expand({
    ignoreProcessEnv: true,
    parsed: dotenv_1["default"].parse(buf)
}).parsed;
if (!config) {
    console.error('dotenv failed to parse config');
    process.exit(1);
}
var deps = [
    'ZM_CLIENT_ID',
    'ZM_CLIENT_SECRET',
    'ZM_REDIRECT_URL',
    'ZM_HOST',
    'SESSION_SECRET',
    'MONGO_USER',
    'MONGO_PASS',
    'MONGO_URL',
    'MONGO_KEY',
    'MONGO_SIGN',
];
// Check that we have all our config dependencies
var hasMissing = false;
for (var dep in deps) {
    var conf = deps[dep];
    var val = config[conf];
    if (!val) {
        console.error("".concat(conf, " is required"));
        hasMissing = true;
    }
}
if (hasMissing) {
    console.error('Missing required .env values...exiting');
    process.exit(1);
}
var p = config.PORT || process.env.PORT;
exports.zoomApp = {
    name: config.APP_NAME || 'zoom-server',
    host: config.ZM_HOST,
    clientId: config.ZM_CLIENT_ID,
    clientSecret: config.ZM_CLIENT_SECRET,
    redirectUri: config.ZM_REDIRECT_URL
};
// Zoom App Info
exports.appName = exports.zoomApp.name;
exports.redirectUri = exports.zoomApp.redirectUri;
// MongoDB Session
exports.sessionSecret = config.SESSION_SECRET;
// MongoDB and Mongoose
exports.mongoURL = config.MONGO_URL;
exports.encryptionKey = config.MONGO_KEY;
exports.signingKey = config.MONGO_SIGN;
// HTTP
exports.port = p || '3000';
// require secrets are explicitly imported
exports["default"] = {
    appName: exports.appName,
    redirectUri: exports.redirectUri,
    port: exports.port,
    mongoURL: exports.mongoURL
};
