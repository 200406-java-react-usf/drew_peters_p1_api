/**
 * 
 */
export interface UserSchema {
    ers_user_id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: string
}
/**
 * 
 */
export interface ReimbursementSchema {
    reimb_id: number,
    amount: number,
    submitted: Date,
    resolved: Date,
    description: string,
    reciept: any,
    author: string,
    resolver: string,
    reimb_status: string,
    reimb_type: string
}