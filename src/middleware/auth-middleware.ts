import { Request, Response } from "express";
import { AuthenticationError, AuthorizationError } from "../errors/errors";

export const adminGuard = (req: Request, resp: Response, next: any) => {
    console.log('AUTH REQUESTED @/auth');
    if (!req.session.principal) {
        resp.status(401).json(new AuthenticationError('No session found! Please login.'));
    } else if (req.session.principal.role_name === 'admin') {
        next();
    } else {
        resp.status(403).json(new AuthorizationError());
    }
}