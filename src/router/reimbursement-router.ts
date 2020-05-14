// import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
// import { isEmptyObject } from '../util/validator';
// import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const ReimbursementRouter = express.Router();

const reimbursementService = AppConfig.reimbursementService;

ReimbursementRouter.get('', adminGuard, async (req, resp) => {
    console.log('GET ALL REIMB REQUESTED @/reimbursement');
    try {
        let payload = await reimbursementService.getAllReimbursements();
        return resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/:id', adminGuard, async (req, resp) => {
    console.log('GET REIMB BY ID REQUESTED @/reimbursement');
    const id = +req.params.id;
    try {     
        let payload = await reimbursementService.getReimbursementById(id); 
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.post('', adminGuard, async (req, resp) => {

    console.log('NEW REIMB REQUESTED @/reimbursement');
    console.log(req.body);
    try {
        let newUser = await reimbursementService.addNewReimbursement(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.patch('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    console.log('UPDATE REIMB REQUESTED @/reimbursement');
    console.log(req.body);
    try {
        let status = await reimbursementService.updateReimbursement(req.body);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.delete('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    console.log('DELETE REIMB REQUESTED @/reimbursement');
    console.log(req.body);
    try {
        let status = await reimbursementService.deleteById(id);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});