export class Reimbursement {

    reimb_id: number;
    amount: number;
    submitted: string;
    resolved: string;
    description: string;
    reciept: any;
    author_id: number;
    resolver_id: number;
    reimb_status: string;
    reimb_type: string;

    constructor(
        id: number,
        am: number,
        sub: string,
        res: string,
        des: string,
        rec: any,
        auth_id: number,
        res_id: number,
        rei_sta: string,
        rei_typ: string
    ) {
        this.reimb_id = id;
        this.amount = am;
        this.submitted = sub;
        this.resolved = res;
        this.description = des;
        this.reciept = rec;
        this.author_id = auth_id;
        this.resolver_id = res_id;
        this.reimb_status = rei_sta;
        this.reimb_type = rei_typ;
    }

}