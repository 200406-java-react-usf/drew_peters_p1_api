export class Reimbursement {

    id: number;
    reimb_type: string;
    
    constructor(id: number, reimb_type: string) {
        this.id = id;
        this.reimb_type = reimb_type;
    }
}