import express, { Request, Response } from 'express';
import createError from 'http-errors';
import { getInstallURL } from '../helpers/zoom-api.js';
import session from '../session.js';

const router = express.Router();

/*
 * Install Route - Install the Zoom App from the Zoom Marketplace
 * this route is used when a user installs the app from the Zoom Client
 */
const installHandler = async (req: Request, res: Response) => {
    if (!req.session) return createError(500, 'Cannot read session data');

    const { url, state, verifier } = getInstallURL();
    req.session['state'] = state;
    req.session['verifier'] = verifier;

    res.redirect(url.href);
};
router.get('/install', session, installHandler);

export default router;
