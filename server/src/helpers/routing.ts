import { validationResult } from 'express-validator';
import createError from 'http-errors';
import { Exception } from '../models/exception.js';

/**
 * sanitize - throw an error if the request did not pass validation
 */
export function sanitize(req: Express.Request) {
    return new Promise<void>((resolve, reject) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) resolve();

        const { msg } = errors.array({ onlyFirstError: true })[0];
        const e = new Exception(msg, 400);
        reject(e);
    });
}

/**
 * Passes errors to the error handler route
 */
export function handleError(e: Exception): Error {
    let status = e.code;
    let data = e.message;

    if (e.response) {
        status = e.response.status.toString();
        data = e.response.data;
    } else if (e.request) {
        data = e.request.data;
    }

    return createError(status || 500, data);
}
