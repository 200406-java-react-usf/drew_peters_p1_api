
import { Request, Response } from 'express';
import { AuthorizationError } from '../errors/errors';

export const adminGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthorizationError('No login detected. Please login.'));
    } else if (req.session.principal.role === 'Admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError('You need admin access to do this.'));
    }
}

export const managerGuard = (req: Request, resp: Response, next) => {

    if (!req.session.principal) {
        resp.status(401).json(new AuthorizationError('No login detected. Please login.'));
    } else if (req.session.principal.role === 'Manager') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }
}