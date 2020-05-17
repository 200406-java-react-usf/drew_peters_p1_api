export class Reimbursement {

    reimb_id: number;
    amount: number;
    submitted: Date;
    resolved: Date;
    description: string;
    receipt: number;
    author: string;
    resolver: string;
    reimb_status: string;
    reimb_type: string;

    constructor(id: number, 
                amount: number, 
                submitted: Date, 
                resolved: Date, 
                description: string, 
                receipt: number, 
                author: string, 
                resolver: string, 
                reimb_status: string, 
                reimb_type: string) 
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