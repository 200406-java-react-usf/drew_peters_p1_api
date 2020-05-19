import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const ReimbursementRouter = express.Router();

const reimbursementService = AppConfig.reimbursementService;

ReimbursementRouter.get('', adminGuard, async (req, resp) => {
    console.log('GET ALL REIMB REQUESTED @/reimbursements');
    try {
        let reqURL = url.parse(req.url, true);
        if(!isEmptyObject(reqURL.query)) {
            let payload = await reimbursementService.getReimbursementByUniqueKey({...reqURL.query});
            return resp.status(200).json(payload);
        } else {
            let payload = await reimbursementService.getAllReimbursements();
            return resp.status(200).json(payload);
        }
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/:id', adminGuard, async (req, resp) => {
    console.log('GET REIMB BY ID REQUESTED @/reimbursements');
    const id = +req.params.id;
    try {     
        let payload = await reimbursementService.getReimbursementById(id); 
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/query', adminGuard, async (req, res) => {
    console.log('GET REIMB BY UNIQUE KEY REQUESTED @/reimbursements');
    let reqURL = url.parse(req.url, true);
    if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
        let payload = await reimbursementService.getReimbursementByUniqueKey({...reqURL.query});
        res.status(200).json(payload);
    } else {
        let payload = await reimbursementService.getAllReimbursements();
        res.status(200).json(payload);
    }

});

ReimbursementRouter.post('', adminGuard, async (req, resp) => {

    console.log('NEW REIMB REQUESTED @/reimbursements');
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
    console.log('UPDATE REIMB REQUESTED @/reimbursements');
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
    console.log('DELETE REIMB REQUESTED @/reimbursements');
    console.log(req.body);
    try {
        let status = await reimbursementService.deleteById(id);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});