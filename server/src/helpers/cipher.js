"use strict";
exports.__esModule = true;
exports.contextHeader = exports.getAppContext = void 0;
var crypto_1 = require("crypto");
var http_errors_1 = require("http-errors");
var config_js_1 = require("../config.js");
/**
 * Decode and parse a base64 encoded Zoom App Context
 * @param {String} ctx - Encoded Zoom App Context
 * @return {Object} Decoded Zoom App Context object
 */
function unpack(ctx) {
    // Decode base64
    var buf = Buffer.from(ctx, 'base64');
    // Get iv length (1 byte)
    var ivLength = buf.readUInt8();
    buf = buf.slice(1);
    // Get iv
    var iv = buf.slice(0, ivLength);
    buf = buf.slice(ivLength);
    // Get aad length (2 bytes)
    var aadLength = buf.readUInt16LE();
    buf = buf.slice(2);
    // Get aad
    var aad = buf.slice(0, aadLength);
    buf = buf.slice(aadLength);
    // Get cipher length (4 bytes)
    var cipherLength = buf.readInt32LE();
    buf = buf.slice(4);
    // Get cipherText
    var cipherText = buf.slice(0, cipherLength);
    // Get tag
    var tag = buf.slice(cipherLength);
    return {
        iv: iv,
        aad: aad,
        cipherText: cipherText,
        tag: tag
    };
}
/**
 * Decrypts cipherText from a decoded Zoom App Context object
 * @param {Buffer} cipherText - Data to decrypt
 * @param {Buffer} hash - sha256 hash of the Client Secret
 * @param {Buffer} iv - Initialization Vector for cipherText
 * @param {Buffer} aad - Additional Auth Data for cipher
 * @param {Buffer} tag - cipherText auth tag
 * @return {JSON|Error} Decrypted JSON obj from cipherText or Error
 */
function decrypt(cipherText, hash, iv, aad, tag) {
    // AES/GCM decryption
    var decipher = crypto_1["default"]
        .createDecipheriv('aes-256-gcm', hash, iv)
        .setAAD(aad)
        .setAuthTag(tag)
        .setAutoPadding(false);
    var enc = 'hex';
    var update = decipher.update(cipherText.toString(enc), enc, 'utf-8');
    var final = decipher.final('utf-8');
    var decrypted = update + final;
    return JSON.parse(decrypted);
}
/**
 * Decodes, parses and decrypts the x-zoom-server-context header
 * @see https://marketplace.zoom.us/docs/beta-docs/zoom-apps/zoomappcontext#decrypting-the-header-value
 * @param {String} header - Encoded Zoom App Context header
 * @param {String} [secret=''] - Client Secret for the Zoom App
 * @return {JSON|Error} Decrypted Zoom App Context or Error
 */
function getAppContext(header, secret) {
    if (secret === void 0) { secret = ''; }
    if (!header)
        throw (0, http_errors_1["default"])(500, 'context header must be a valid string');
    var key = secret || config_js_1.zoomApp.clientSecret;
    // Decode and parse context
    var _a = unpack(header), iv = _a.iv, aad = _a.aad, cipherText = _a.cipherText, tag = _a.tag;
    // Create sha256 hash from Client Secret (key)
    var hash = crypto_1["default"].createHash('sha256').update(key).digest();
    // return decrypted context
    return decrypt(cipherText, hash, iv, aad, tag);
}
exports.getAppContext = getAppContext;
exports.contextHeader = 'x-zoom-app-context';
