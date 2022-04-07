"use strict";
exports.__esModule = true;
var debug_1 = require("debug");
var config_js_1 = require("../config.js");
var dbg = (0, debug_1["default"])("".concat(config_js_1.appName, ":error"));
exports["default"] = (function () {
    return function (err, req, res, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next) {
        var status = err.status || 500;
        var title = "Error ".concat(err.status);
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        if (res.locals.error)
            dbg("".concat(title, " %s"), err.stack);
        // render the error page
        res.status(status).render('error');
    };
});
