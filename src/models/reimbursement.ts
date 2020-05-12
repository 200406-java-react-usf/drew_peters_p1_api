import { Receipt } from './receipt';

export class Reimbursement {

    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: number; //placeholder
    author: string;
    resolver: string;
    reimb_status_id: number;
    reimb_type_id: number;

    constructor(id: number, 
                amount: number, 
                submitted: Date, 
                resolved: Date, 
                description: string, 
                receipt: number, 
                author: string, 
                resolver: string, 
                reimb_status_id: number, 
                reimb_type_id: number) 
    {
        this.id = id;
        this.amount = amount;
        this.submitted = submitted;
        this.resolved = resolved;
        this.description = description;
        this.receipt = receipt;
        this.author = author;
        this.resolver = resolver;
        this.reimb_status_id = reimb_status_id;
        this.reimb_type_id = reimb_type_id;
    }
}