import { NextFunction, Request, Response } from 'express';
import debug from 'debug';

import { Exception } from '../models/exception.js';
import { appName } from '../config.js';

const dbg = debug(`${appName}:error`);

export default () =>
    (
        err: Exception,
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
    ) => {
        const status = err.status || 500;
        const title = `Error ${err.status}`;

        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        if (res.locals.error) dbg(`${title} %s`, err.stack);

        // render the error page
        res.status(status).render('error');
    };
