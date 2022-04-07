"use strict";
exports.__esModule = true;
var exception_js_1 = require("../models/exception.js");
var routing_js_1 = require("../helpers/routing.js");
var cipher_js_1 = require("../helpers/cipher.js");
var zoom_api_js_1 = require("../helpers/zoom-api.js");
var maxLen = 512;
/**
 * Decrypt the Zoom App Context or prompt the user to open Zoom
 */
exports["default"] = (function () { return function (req, res, next) {
    var header = req.header(cipher_js_1.contextHeader);
    if (!header)
        return res.render('install', {
            installURL: (0, zoom_api_js_1.getInstallURL)()
        });
    if (header.length > maxLen) {
        var e = new exception_js_1.Exception("Zoom App Context Header must be < ".concat(maxLen, " characters"), 400);
        return next((0, routing_js_1.handleError)(e));
    }
    var _a = (0, cipher_js_1.getAppContext)(header), uid = _a.uid, mid = _a.mid;
    req.session.userId = uid;
    req.session.meetingUUID = mid;
    next();
}; });
