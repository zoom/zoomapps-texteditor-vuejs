"use strict";
exports.__esModule = true;
exports.handleError = exports.sanitize = void 0;
var express_validator_1 = require("express-validator");
var http_errors_1 = require("http-errors");
var exception_js_1 = require("../models/exception.js");
/**
 * sanitize - throw an error if the request did not pass validation
 */
function sanitize(req) {
    return new Promise(function (resolve, reject) {
        var errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty())
            resolve();
        var msg = errors.array({ onlyFirstError: true })[0].msg;
        var e = new exception_js_1.Exception(msg, 400);
        reject(e);
    });
}
exports.sanitize = sanitize;
/**
 * Passes errors to the error handler route
 */
function handleError(e) {
    var status = e.code;
    var data = e.message;
    if (e.response) {
        status = e.response.status.toString();
        data = e.response.data;
    }
    else if (e.request) {
        data = e.request.data;
    }
    return (0, http_errors_1["default"])(status || 500, data);
}
exports.handleError = handleError;
