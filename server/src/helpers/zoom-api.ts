import axios, { Method } from 'axios';
import { URL } from 'url';
import createError from 'http-errors';
import { zoomApp } from '../config.js';

// Get Zoom API URL from Zoom Host value
const host = new URL(zoomApp.host);
host.hostname = host.hostname.replace(/^/, 'api.');

const baseURL = host.href;

/**
 * Generic function for retrieving access or refresh tokens
 * @param params - Request parameters (form-urlencoded)
 * @param [id=''] - Username for Basic Auth
 * @param [secret=''] - Password for Basic Auth
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
 * Generic function to make a request to the Zoom API
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
 * @param token - Access Token
 */
export function getAuthHeader(token: string) {
    return `Bearer ${token}`;
}

export function getInstallURL() {
    const url = new URL('/oauth/authorize', zoomApp.host);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', zoomApp.clientId);
    url.searchParams.set('redirect_uri', zoomApp.redirectUrl);
    return url.href;
}

/**
 * Obtains an OAuth access token from Zoom
 * @param code - Authorization code from user authorization
 */
export async function getToken(code: string) {
    if (!code)
        throw createError(500, 'authorization code must be a valid string');

    const params = new URLSearchParams({
        code,
        redirect_uri: zoomApp.redirectUrl,
        grant_type: 'authorization_code',
    });
    return tokenRequest(params);
}

/**
 * Obtain a new Access Token from a Zoom Refresh Token
 * @param token - Refresh token to use
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
