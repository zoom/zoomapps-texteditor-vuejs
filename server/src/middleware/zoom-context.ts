import { NextFunction, Request, Response } from 'express';
import { Exception } from '../models/exception.js';

import { handleError } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { getInstallURL } from '../helpers/zoom-api.js';

const maxLen = 512;

/**
 * Decrypt the Zoom App Context or prompt the user to open Zoom
 */
export default () => (req: Request, res: Response, next: NextFunction) => {
    const header = req.header(contextHeader);

    if (!header)
        return res.render('install', {
            installURL: getInstallURL(),
        });

    if (header.length > maxLen) {
        const e = new Exception(
            `Zoom App Context Header must be < ${maxLen} characters`,
            400
        );
        return next(handleError(e));
    }

    const { uid, mid } = getAppContext(header);
    req.session.userId = uid;
    req.session.meetingUUID = mid;

    next();
};
