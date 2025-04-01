import promisePool from "../config/mysql.config.js";
import User,{USER_PROPS} from "../models/User.model.js";
import { ServerError } from "../utils/errors.util.js";

class UserRepository {
//     async create({username, email, password, verification_token, profile_image_base64}) {
//         try {
//             await User.create({[USER_PROPS.USERNAME]: username, [USER_PROPS.EMAIL]: email, [USER_PROPS.PASSWORD]: password,[USER_PROPS.VERIFICATION_TOKEN]: verification_token, [USER_PROPS.PROFILE_IMAGE_BASE64]: profile_image_base64});
//         }
//         catch (error) {
//             console.log(error)
//             if(error.code === 11000){
//                 if(error.keyPattern.username){
//                     throw new ServerError("username already exists", 400);
//                 }
//                 if(error.keyPattern.email){
//                     throw new ServerError("email already exists", 400);
//                 }
//             throw error;
//         }


//     }
// }

async create({username, email, password, verification_token, profile_image_base64}) {
    try {
        //inyeccion sql 
        let queryStr = `
        INSERT INTO users (username, email, password, verification_token, profile_image_base64)
        VALUES (?, ?, ?, ?, ? )
        `
        const [result] = await promisePool.execute(queryStr, [username, email, password, verification_token, profile_image_base64]);
    }
    catch (error) {
        console.log(error)
        if(error.code === 11000){
            if(error.keyPattern.username){
                throw new ServerError("username already exists", 400);
            }
            if(error.keyPattern.email){
                throw new ServerError("email already exists", 400);
            }
        throw error;
    }


}
}

// async verifyUserByEmail (email){
//     const user_found = await User.findOne({[USER_PROPS.EMAIL]: email});

//     if(!user_found){
//         throw new ServerError("user not found", 404)
//     }

//     if(user_found.verified){
//         throw new ServerError("email already verified", 400)
//     }

//     // if(user_found.verification_token !== verification_token){
//     //     throw new ServerError("verification token invalid", 400)
//     // }
//     user_found.verified = true
//     await user_found.save()
//     return user_found
// }

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
    const queryStr = `
    UPDATE users SET verified = 1 WHERE email = ? AND verification_token = ?
    `
    promisePool.execute(queryStr, [email, verification_token])

    return user_found
}


    // async findUserByEmail(email){
    //     return await User.findOne({[USER_PROPS.EMAIL]: email})
    // }

    async findUserByEmail(email){
        const queryStr = `
        SELECT * FROM users WHERE email = ?
        `
        const [result] = await promisePool.execute(queryStr, [email]);
        console.log("result", result)
        return result[0] 
    }

    // async changeUserPassword(id, newPassword) {
    //     const foundUser = await User.findById(id)
    //     if(!foundUser) throw new ServerError('User not found', 404)
    //     foundUser.password = newPassword
    //     await foundUser.save()
    // }

    
    async changeUserPassword(id, newPassword) {
        const queryStr = `UPDATE users SET password = ? WHERE _id = ?`
        
        const [result] = await promisePool.execute(queryStr, [newPassword, id])
        

        return result[0]
    }

}




const userRepository = new UserRepository();




export default userRepository