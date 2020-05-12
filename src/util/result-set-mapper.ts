import { UserSchema } from "./schemas";
import { User } from "../models/user";
import { ReimbursementSchema } from "./schemas";
import { Reimbursement } from "../models/reimbursement";

/**
 * 
 */
export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );
}
/**
 * 
 */
export function mapReimbursementResultSet(resultSet: ReimbursementSchema): Reimbursement {
    
    if (!resultSet) {
        return {} as Reimbursement;
    }

    return new Reimbursement(
        resultSet.id,
        resultSet.amount,
        resultSet.submitted,
        resultSet.resolved,
        resultSet.description,
        resultSet.receipt,
        resultSet.author,
        resultSet.resolver,
        resultSet.reimb_status_id,
        resultSet.reimb_type_id
    );
}