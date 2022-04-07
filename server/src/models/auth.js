"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.authSchema = void 0;
var mongoose_1 = require("mongoose");
var mongoose_encryption_1 = require("mongoose-encryption");
var config_js_1 = require("../config.js");
var Schema = mongoose_1["default"].Schema;
var options = {
    unique: true,
    required: true,
    dropDups: true
};
exports.authSchema = new Schema({
    accessToken: __assign({ type: String }, options),
    refreshToken: __assign({ type: String }, options),
    expiresAt: {
        type: String,
        "default": Date.now,
        required: true
    },
    scope: String
}, {
    timestamps: true
});
exports.authSchema.plugin(mongoose_encryption_1["default"], {
    encryptionKey: config_js_1.encryptionKey,
    signingKey: config_js_1.signingKey,
    decryptPostSave: false
});
exports["default"] = mongoose_1["default"].model('Auth', exports.authSchema);
