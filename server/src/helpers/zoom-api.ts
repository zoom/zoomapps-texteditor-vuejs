import axios, { Method } from 'axios';
import { URL } from 'url';
import createError from 'http-errors';
import { zoomApp } from '../config.js';

// Get Zoom API URL from Zoom Host value
const host = new URL(zoomApp.host);
host.hostname = host.hostname.replace(/^/, 'api.');

const baseURL = host.href;

/**
 * Generic function for getting access or refresh tokens
 * @param {string} [id] - Username for Basic Auth
 * @param {string} [secret] - Password for Basic Auth
 * @param {URLSearchParams} params - Request parameters (form-urlencoded)
 */
function tokenRequest(params: URLSearchParams, id?: string, secret?: string) {
    const username = id || zoomApp.clientId;
    const password = secret || zoomApp.clientSecret;

    return axios({
        data: params.toString(),
        baseURL: zoomApp.host,
        url: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username,
            password,
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * @param {Method} method - Request method
 * @param {string | URL} endpoint - Zoom API Endpoint
 * @param {string} token - Access Token
 * @param {object} [data=null] - Request data
 */
function apiRequest(
    method: Method,
    endpoint: string,
    token: string,
    data?: unknown
) {
    return axios({
        data,
        method,
        baseURL,
        url: `/v2${endpoint}`,
        headers: {
            Authorization: getAuthHeader(token),
        },
    }).then(({ data }) => Promise.resolve(data));
}

/**
 * Get the authorization header for the Zoom API
 * @param {String} token - Access Token
 * @return {String} Zoom API Authorization header
 */
export function getAuthHeader(token: string) {
    return `Bearer ${token}`;
}

export function getInstallURL() {
    const url = new URL('/oauth/authorize', zoomApp.host);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', zoomApp.clientId);
    url.searchParams.set('redirect_uri', zoomApp.redirectUri);
    return url.href;
}

/**
 * Obtains an OAuth access token from Zoom
 * @param {string} code - Authorization code from user authorization
 * @return {Promise}  Promise resolving to the access token object
 */
export async function getToken(code: string) {
    if (!code)
        throw createError(500, 'authorization code must be a valid string');

    const params = new URLSearchParams({
        code,
        redirect_uri: zoomApp.redirectUri,
        grant_type: 'authorization_code',
    });
    return tokenRequest(params);
}

/**
 * Obtain a new Access Token from a Zoom Refresh Token
 * @param {string} token - Refresh token to use
 * @return {Promise<void>}
 */
export async function refreshToken(token: string) {
    if (!token) throw createError(500, 'refresh token must be a valid string');

    const params = new URLSearchParams({
        refresh_token: token,
        grant_type: 'refresh_token',
    });

    return tokenRequest(params);
}

/**
 * Use the Zoom API to get a Zoom User
 * @param {string} uid - User ID to query on
 * @param {string} token Zoom App Access Token
 */
export function getZoomUser(uid: string, token: string) {
    return apiRequest('GET', `/users/${uid}`, token);
}

/**
 * Return the DeepLink for opening Zoom
 * @param {string} token - Zoom App Access Token
 * @return {Promise}
 */
export function getDeeplink(token: string) {
    return apiRequest('POST', '/zoomapp/deeplink', token, {
        action: JSON.stringify({
            url: '/',
            role_name: 'Owner',
            verified: 1,
            role_id: 0,
        }),
    }).then((data) => Promise.resolve(data.deeplink));
}
