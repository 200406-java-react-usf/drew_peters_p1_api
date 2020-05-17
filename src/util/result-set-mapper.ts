import { UserSchema } from "./schemas";
import { User } from "../models/user";
import { ReimbursementSchema } from "./schemas";
import { Reimbursement } from "../models/reimbursement";

// based on userschema, map user result sets with given values
export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.ers_user_id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );
}

// based on reimbursementschema, map reimbursement result sets with given values
export function mapReimbursementResultSet(resultSet: ReimbursementSchema): Reimbursement {
    
    if (!resultSet) {
        return {} as Reimbursement;
    }

    return new Reimbursement(
        resultSet.reimb_id,
        resultSet.amount,
        resultSet.submitted,
        resultSet.resolved,
        resultSet.description,
        resultSet.reciept,
        resultSet.author,
        resultSet.resolver,
        resultSet.reimb_status,
        resultSet.reimb_type
    );
}