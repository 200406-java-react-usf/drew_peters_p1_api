import { Receipt } from './receipt';

export class Reimbursement {

    id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: number;
    author_id: number;
    resolver_id: number;
    reimb_status_id: number;
    reimb_type_id: number;

    constructor(id: number, 
                amount: number, 
                submitted: Date, 
                resolved: Date, 
                description: string, 
                receipt: number, 
                author_id: number, 
                resolver_id: number, 
                reimb_status_id: number, 
                reimb_type_id: number) 
    {
        this.id = id;
        this.amount = amount;
        this.submitted = submitted;
        this.resolved = resolved;
        this.description = description;
        this.receipt = receipt;
        this.author_id = author_id;
        this.resolver_id = resolver_id;
        this.reimb_status_id = reimb_status_id;
        this.reimb_type_id = reimb_type_id;
    }
}