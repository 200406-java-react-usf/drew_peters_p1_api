import { Receipt } from './receipt';

export class Reimbursement {

    reimb_id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: number;
    author: number;
    resolver: number;
    reimb_status: number;
    reimb_type: number;

    constructor(id: number, 
                amount: number, 
                submitted: Date, 
                resolved: Date, 
                description: string, 
                receipt: number, 
                author: number, 
                resolver: number, 
                reimb_status: number, 
                reimb_type: number) 
    {
        this.reimb_id = id;
        this.amount = amount;
        this.submitted = submitted;
        this.resolved = resolved;
        this.description = description;
        this.receipt = receipt;
        this.author = author;
        this.resolver = resolver;
        this.reimb_status = reimb_status;
        this.reimb_type = reimb_type;
    }
}