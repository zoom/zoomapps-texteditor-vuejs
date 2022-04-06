import { NextFunction, Request, Response } from 'express';
import { handleError } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { getInstallURL } from '../helpers/zoom-api.js';

import { Exception } from '../models/exception.js';

const maxLen = 512;

/**
 * ZoomContext will decrypt the Zoom App Context for a request
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next function
 * @constructor
 */
export async function ZoomContext(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const header = req.header(contextHeader);

        if (!header)
            return res.render('install', {
                installURL: getInstallURL(),
            });

        if (header.length > maxLen) {
            const e = new Exception(
                'Zoom App Context Header must be < ${maxLen} characters',
                400
            );
            return next(handleError(e));
        }

        const { uid, mid } = getAppContext(header);

        req.session.userId = uid;
        req.session.meetingUUID = mid;

        next();
    } catch (e: unknown) {
        if (!(e instanceof Exception)) return console.error(e);
        next(handleError(e));
    }
}
