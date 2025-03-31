import userRepository from "../repositories/user.repository.js";
import { ServerError } from "../utils/errors.util.js";

class AuthService {
    async verifyUserByEmail (email, verification_token){
        const user_found = await this.findUserByEmail(email);
    
        if(!user_found){
            throw new ServerError("user not found", 404)
        }
    
        if(user_found.verified){
            throw new ServerError("email already verified", 400)
        }
        
        if(user_found.verification_token !== verification_token){
            throw new ServerError("verification token invalid", 400)
        }
        await userRepository.verifyUserByEmail(email, verification_token)
    }
}

const authService = new AuthService();

export default authService;