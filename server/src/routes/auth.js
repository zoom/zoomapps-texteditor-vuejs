"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var debug_1 = require("debug");
var exception_js_1 = require("../models/exception.js");
var routing_js_1 = require("../helpers/routing.js");
var zoom_api_js_1 = require("../helpers/zoom-api.js");
var auth_js_1 = require("../models/auth.js");
var user_js_1 = require("../models/user.js");
var config_js_1 = require("../config.js");
var dbg = (0, debug_1["default"])("".concat(config_js_1.appName, ":auth"));
var router = express_1["default"].Router();
var codeMin = 32;
var codeMax = 64;
var stateMax = 1024;
// Validate the Authorization Code sent from Zoom
var validateQuery = [
    (0, express_validator_1.query)('code')
        .isString()
        .withMessage('code must be a valid string')
        .isLength({ min: codeMin, max: codeMax })
        .withMessage("code must be > ".concat(codeMin, " and < ").concat(codeMax, " chars"))
        .escape(),
    (0, express_validator_1.query)('state')
        .optional()
        .isString()
        .withMessage('state must be a string')
        .isLength({ max: stateMax })
        .withMessage("state must be < ".concat(stateMax, " chars"))
        .escape(),
];
/*
 * Redirect URI - Zoom App Launch handler
 * The user is redirected to this route when they authorize your server
 */
var authHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var code, e, _a, scope, expires_in, accessToken, refreshToken, auth, id, deeplink, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                // sanitize code and state query parameters
                return [4 /*yield*/, (0, routing_js_1.sanitize)(req)];
            case 1:
                // sanitize code and state query parameters
                _b.sent();
                code = req.query.code;
                // we have to check the type for TS so let's add an error too
                if (typeof code !== 'string') {
                    e = new exception_js_1.Exception('invalid code parameter received', 400);
                    return [2 /*return*/, next((0, routing_js_1.handleError)(e))];
                }
                return [4 /*yield*/, (0, zoom_api_js_1.getToken)(code)];
            case 2:
                _a = _b.sent(), scope = _a.scope, expires_in = _a.expires_in, accessToken = _a.access_token, refreshToken = _a.refresh_token;
                return [4 /*yield*/, auth_js_1["default"].create({
                        scope: scope,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expiresAt: Date.now() + expires_in * 1000
                    })];
            case 3:
                auth = _b.sent();
                return [4 /*yield*/, (0, zoom_api_js_1.getZoomUser)('me', accessToken)];
            case 4:
                id = (_b.sent()).id;
                // create a new user if one doesn't exist
                return [4 /*yield*/, user_js_1["default"].updateOne({ id: id }, { id: id, auth: auth }, { upsert: true })];
            case 5:
                // create a new user if one doesn't exist
                _b.sent();
                return [4 /*yield*/, (0, zoom_api_js_1.getDeeplink)(accessToken)];
            case 6:
                deeplink = _b.sent();
                // redirect the user to the Zoom Client
                res.redirect(deeplink);
                return [3 /*break*/, 8];
            case 7:
                e_1 = _b.sent();
                if (!(e_1 instanceof exception_js_1.Exception))
                    return [2 /*return*/, dbg(e_1)];
                return [2 /*return*/, next((0, routing_js_1.handleError)(e_1))];
            case 8: return [2 /*return*/];
        }
    });
}); };
router.get('/', validateQuery, authHandler);
exports["default"] = router;
