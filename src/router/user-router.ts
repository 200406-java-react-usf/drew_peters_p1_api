import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
// import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', adminGuard, async (req, resp) => {
    console.log('GET ALL USERS REQUESTED @/users');
    try {
        let reqURL = url.parse(req.url, true);
        if(!isEmptyObject(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

UserRouter.get('/:id', adminGuard, async (req, resp) => {
    console.log('GET USER BY ID REQUESTED @/users');
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.post('', adminGuard, async (req, resp) => {
    console.log('NEW USER REQUESTED @/users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.patch('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    console.log('UPDATE USER REQUESTED @/users');
    console.log(req.body);
    try {
        let status = await userService.updateUser(req.body);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.delete('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    console.log('DELETE USER REQUESTED @/users');
    console.log(req.body);
    try {
        let status = await userService.deleteById(id);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});