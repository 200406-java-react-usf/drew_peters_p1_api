import express from 'express';
import AppConfig from '../config/app';

export const ReimbursementRouter = express.Router();

const reimbursementService = AppConfig.reimbursementService;

ReimbursementRouter.get('', async (req, resp) => {
    console.log('GET ALL REIMB REQUESTED @/reimbursements');
    try {
        let payload = await reimbursementService.getAllReimbursements();
            return resp.status(200).json(payload);
        }
        catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/:id', async (req, resp) => {
    console.log('GET REIMB BY ID REQUESTED @/reimbursements');
    const id = +req.params.id;
    try {     
        let payload = await reimbursementService.getReimbursementById(id); 
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.get('/:username', async (req, resp) => {
    const username = req.params.username;
    try {
        let payload = await reimbursementService.getReimbursementByUsername(username);
        resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.post('', async (req, resp) => {

    console.log('NEW REIMB REQUESTED @/reimbursements');
    console.log(req.body);
    try {
        let newUser = await reimbursementService.addNewReimbursement(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

ReimbursementRouter.patch('', async (req, resp) => {
    console.log('UPDATE REIMB REQUESTED @/reimbursements');
    console.log(req.body);
    try {
        let status = await reimbursementService.updateReimbursement(req.body);
        return resp.status(204).json(status);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
});

ReimbursementRouter.delete('/:id', async (req, resp) => {
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