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
exports.getDeeplink = exports.getZoomUser = exports.refreshToken = exports.getToken = exports.getInstallURL = exports.getAuthHeader = void 0;
var axios_1 = require("axios");
var url_1 = require("url");
var http_errors_1 = require("http-errors");
var config_js_1 = require("../config.js");
// Get Zoom API URL from Zoom Host value
var host = new url_1.URL(config_js_1.zoomApp.host);
host.hostname = host.hostname.replace(/^/, 'api.');
var baseURL = host.href;
/**
 * Generic function for retrieving access or refresh tokens
 * @param params - Request parameters (form-urlencoded)
 * @param [id=''] - Username for Basic Auth
 * @param [secret=''] - Password for Basic Auth
 */
function tokenRequest(params, id, secret) {
    var username = id || config_js_1.zoomApp.clientId;
    var password = secret || config_js_1.zoomApp.clientSecret;
    return (0, axios_1["default"])({
        data: params.toString(),
        baseURL: config_js_1.zoomApp.host,
        url: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: username,
            password: password
        }
    }).then(function (_a) {
        var data = _a.data;
        return Promise.resolve(data);
    });
}
/**
 * Generic function to make a request to the Zoom API
 */
function apiRequest(method, endpoint, token, data) {
    return (0, axios_1["default"])({
        data: data,
        method: method,
        baseURL: baseURL,
        url: "/v2".concat(endpoint),
        headers: {
            Authorization: getAuthHeader(token)
        }
    }).then(function (_a) {
        var data = _a.data;
        return Promise.resolve(data);
    });
}
/**
 * Get the authorization header for the Zoom API
 * @param token - Access Token
 */
function getAuthHeader(token) {
    return "Bearer ".concat(token);
}
exports.getAuthHeader = getAuthHeader;
function getInstallURL() {
    var url = new url_1.URL('/oauth/authorize', config_js_1.zoomApp.host);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', config_js_1.zoomApp.clientId);
    url.searchParams.set('redirect_uri', config_js_1.zoomApp.redirectUri);
    return url.href;
}
exports.getInstallURL = getInstallURL;
/**
 * Obtains an OAuth access token from Zoom
 * @param code - Authorization code from user authorization
 */
function getToken(code) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            if (!code)
                throw (0, http_errors_1["default"])(500, 'authorization code must be a valid string');
            params = new URLSearchParams({
                code: code,
                redirect_uri: config_js_1.zoomApp.redirectUri,
                grant_type: 'authorization_code'
            });
            return [2 /*return*/, tokenRequest(params)];
        });
    });
}
exports.getToken = getToken;
/**
 * Obtain a new Access Token from a Zoom Refresh Token
 * @param token - Refresh token to use
 */
function refreshToken(token) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            if (!token)
                throw (0, http_errors_1["default"])(500, 'refresh token must be a valid string');
            params = new URLSearchParams({
                refresh_token: token,
                grant_type: 'refresh_token'
            });
            return [2 /*return*/, tokenRequest(params)];
        });
    });
}
exports.refreshToken = refreshToken;
/**
 * Use the Zoom API to get a Zoom User
 * @param {string} uid - User ID to query on
 * @param {string} token Zoom App Access Token
 */
function getZoomUser(uid, token) {
    return apiRequest('GET', "/users/".concat(uid), token);
}
exports.getZoomUser = getZoomUser;
/**
 * Return the DeepLink for opening Zoom
 * @param {string} token - Zoom App Access Token
 */
function getDeeplink(token) {
    return apiRequest('POST', '/zoomapp/deeplink', token, {
        action: JSON.stringify({
            url: '/',
            role_name: 'Owner',
            verified: 1,
            role_id: 0
        })
    }).then(function (data) { return Promise.resolve(data.deeplink); });
}
exports.getDeeplink = getDeeplink;
