import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
// import { ReimbursementRepository } from "../repos/reimbursement-repo";
// import { ReimbursementService } from "../services/reimbursement-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

// const reimbursementRepo = new ReimbursementRepository();
// const reimbursementService = new ReimbursementService(reimbursementRepo);

export default {
    userService
    // reimbursementService
}