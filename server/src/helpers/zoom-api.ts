import axios, { Method } from 'axios';
import { URL } from 'url';
import createError from 'http-errors';
import { zoomApp } from '../config.js';

import crypto from 'crypto';

// returns a base64 encoded url
const base64URL = (s: string) =>
    s.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

// returns a random string of format fmt
const rand = (fmt: string, depth = 32) =>
    crypto.randomBytes(depth).toString(fmt as BufferEncoding);

// Get Zoom API URL from Zoom Host value
const host = new URL(zoomApp.host);
host.hostname = host.hostname.replace(/^/, 'api.');

const baseURL = host.href;

// returns a random string of format fmt

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
        data: new URLSearchParams(params).toString(),
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
            Authorization: `Bearer ${token}`,
        },
    }).then(({ data }) => Promise.resolve(data));
}

export function getInstallURL() {
    const state = rand('base64');
    const verifier = rand('ascii');

    const digest = crypto
        .createHash('sha256')
        .update(verifier)
        .digest('base64')
        .toString();

    const challenge = base64URL(digest);

    const url = new URL('/oauth/authorize', zoomApp.host);

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', zoomApp.clientId);
    url.searchParams.set('redirect_uri', zoomApp.redirectUrl);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('state', state);

    return { url, state, verifier };
}

/**
 * Obtains an OAuth access token from Zoom
 * @param code - Authorization code from user authorization
 * @param verifier - code verifier for PKCE
 */
export async function getToken(code: string, verifier: string) {
    if (!code)
        throw createError(500, 'authorization code must be a valid string');

    if (!verifier)
        throw createError(500, 'code verifier code must be a valid string');

    const params = new URLSearchParams({
        code,
        code_verifier: verifier,
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
