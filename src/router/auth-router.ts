import express from 'express';
import AppConfig from '../config/app';
import { Principal } from '../dtos/principal';

export const AuthRouter = express.Router();

const userService = AppConfig.userService;

AuthRouter.get('', (req, resp) => {
    delete req.session.principal;
    resp.status(204).send();
});

AuthRouter.post('', async (req,resp) => {
    try {
        const { username, password } = req.body;
        let authUser = await userService.authenticateUser(username, password);
        let payload = new Principal(authUser.ers_user_id, authUser.username, authUser.role_name);
        req.session.principal = payload;
        let loggedInUser = await userService.getUserById(authUser.ers_user_id);
        resp.status(200).json(loggedInUser);
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }
});