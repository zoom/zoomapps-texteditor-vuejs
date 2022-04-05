import { validationResult } from 'express-validator';
import createError from 'http-errors';
import { Exception } from '../models/exception.js';
import { AxiosError } from 'axios';

/**
 * sanitize - throw an error if the request did not pass validation
 * @param {Request} req - HTTP request to operate on
 */
export function sanitize(req: Express.Request) {
    return new Promise<void>((resolve, reject) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) resolve();

        const { msg } = errors.array({ onlyFirstError: true })[0];
        const e = new Exception(msg);
        e.code = '400';

        reject(e);
    });
}

/**
 * Passes errors to the error handler route
 * @param {Exception} e - error created by axios or manually using e.code and e.message
 * @return {Error}
 */
export function handleError(e: AxiosError | Exception) {
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
