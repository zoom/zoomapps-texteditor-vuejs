"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var mongoose_encryption_1 = require("mongoose-encryption");
var auth_js_1 = require("./auth.js");
var config_js_1 = require("../config.js");
var Schema = mongoose_1["default"].Schema;
var userSchema = new Schema({
    id: { type: String, unique: true, required: true, dropDups: true },
    auth: [auth_js_1.authSchema]
}, {
    timestamps: true
});
userSchema.plugin(mongoose_encryption_1["default"], {
    encryptionKey: config_js_1.encryptionKey,
    signingKey: config_js_1.signingKey,
    encryptedFields: [],
    decryptPostSave: false,
    additionalAuthenticatedFields: ['auth']
});
var User = mongoose_1["default"].model('User', userSchema);
exports["default"] = User;
