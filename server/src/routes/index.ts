import express, { NextFunction, Request, Response } from 'express';
import { header } from 'express-validator';
import { handleError, sanitize } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { getInstallURL } from '../helpers/zoom-api.js';

import { Exception } from '../models/exception.js';

const router = express.Router();

const headerMax = 512;

const validateHeader = header(contextHeader)
    .isString()
    .withMessage(`${contextHeader} header must be a base64 string`)
    .isLength({ max: headerMax })
    .withMessage(`${contextHeader} header must be < ${headerMax} chars`)
    .optional()
    .escape();

/*
 * Home Page - Zoom App Launch handler
 * this route is used when a user navigates to the deep link
 */

const indexHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await sanitize(req);

        const header = req.header(contextHeader);

        if (!header) return res.status(400).send('app context is blank');

        const { uid, mid } = getAppContext(header);

        return res.send({
            uid,
            mid,
            installURL: getInstallURL(),
        });
    } catch (e: unknown) {
        if (!(e instanceof Exception)) return console.error(e);
        next(handleError(e));
    }
};

/*
 * Install Route - Install the Zoom App from the Zoom Marketplace
 * this route is used when a user installs the server from the Zoom Client
 */
const installHandler = async (req: Request, res: Response) =>
    res.redirect(getInstallURL());

router.get('/', validateHeader, indexHandler);
router.get('/install', validateHeader, installHandler);

export default router;
