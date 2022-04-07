"use strict";
exports.__esModule = true;
var debug_1 = require("debug");
var url_1 = require("url");
var config_js_1 = require("../config.js");
var dbg = (0, debug_1["default"])("".concat(config_js_1.appName, ":axios"));
var isProd = process.env.NODE_ENV === 'production';
var printLog = function (method, path, baseURL, status) {
    var msg = method ? "".concat(method.toUpperCase(), " ") : '';
    if (status)
        msg = "".concat(status.toString(), " ").concat(msg, " ");
    if (path && baseURL)
        msg += new url_1.URL(path, baseURL).href;
    else if (baseURL)
        msg += baseURL;
    dbg(msg);
};
var logger = {
    response: function (r) {
        if (isProd)
            return r;
        var status = r.status, _a = r.config, method = _a.method, url = _a.url, baseURL = _a.baseURL;
        printLog(method, url, baseURL, status);
        return r;
    },
    request: function (r) {
        if (isProd)
            return r;
        var method = r.method, url = r.url, baseURL = r.baseURL;
        printLog(method, url, baseURL);
        return r;
    }
};
exports["default"] = logger;
