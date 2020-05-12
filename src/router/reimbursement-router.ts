// import url from 'url';
// import express from 'express';
// import AppConfig from '../config/app';
// import { isEmptyObject } from '../util/validator';
// import { ParsedUrlQuery } from 'querystring';
// import { adminGuard } from '../middleware/auth-middleware';

// export const ReimbursementRouter = express.Router();

// const reimbursementService = AppConfig.reimbursementService;

// ReimbursementRouter.get('', adminGuard, async (req, resp) => {

//     try {

//         let reqURL = url.parse(req.url, true);

//         if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
//             let payload = await reimbursementService.getReimbursementByUniqueKey({...reqURL.query});
//             resp.status(200).json(payload);
//         } else {
//             let payload = await reimbursementService.getAllReimbursements();
//             resp.status(200).json(payload);
//         }

//     } catch (e) {
//         resp.status(e.statusCode).json(e);
//     }

// });

// ReimbursementRouter.get('/:id', async (req, resp) => {
//     const id = +req.params.id;
//     try {
//         let payload = await reimbursementService.getReimbursementById(id);
//         return resp.status(200).json(payload);
//     } catch (e) {
//         return resp.status(e.statusCode).json(e);
//     }
// });

// ReimbursementRouter.post('', async (req, resp) => {

//     console.log('POST REQUEST RECEIVED AT /reimbursements');
//     console.log(req.body);
//     try {
//         let newReimbursement = await reimbursementService.addNewReimbursement(req.body);
//         return resp.status(201).json(newReimbursement);
//     } catch (e) {
//         return resp.status(e.statusCode).json(e);
//     }

// });