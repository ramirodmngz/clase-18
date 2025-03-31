import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../utils/errors.util.js";
import jwt from "jsonwebtoken";



export const authMiddleware = (request, response, next) =>{
    try{
        const authorization_header = request.headers["authorization"]
        if(!authorization_header){
            throw new ServerError("No has proporcionado un token de autenticacion", 401)
        }

        const authorization_token = authorization_header.split(" ")[1]
        if(!authorization_token){
            throw new ServerError("no has proporcionado un token de autenticacion", 401)
        }
        try{
            const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT)
            request.user = user_info
            next()
        } 
        catch(error){
            throw new ServerError("token de autenticacion invalida", 400)
        }

        

        

    } catch (error) {
        console.log("error al validar token", error);
        if (error.status) {
            return response.send({
                ok: false,
                status: error.status,
                message: error.message
            })
        }
        return response.send({
            message: "Internal server error",
            status: 500,
            ok: true
        })
    }
}

// import ENVIROMENT from "../config/enviroment.config.js";
// import { ServerError } from "../utils/errors.util.js";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (request, response, next) => {
//     try {
//         console.log(request.headers)
//         const authorization_header = request.headers["authorization"];
//         if (!authorization_header) {
//             return response.status(401).json({
//                 ok: false,
//                 status: 401,
//                 message: "No has proporcionado un token de autenticación",
//             });
//         }

//         const authorization_token = authorization_header.split(" ")[1];
//         if (!authorization_token) {
//             return response.status(401).json({
//                 ok: false,
//                 status: 401,
//                 message: "No has proporcionado un token de autenticación",
//             });
//         }

//         try {
//             const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT);
//             request.user = user_info;
//             next();
//         } catch (error) {
//             return response.status(400).json({
//                 ok: false,
//                 status: 400,
//                 message: "Token de autenticación inválido",
//             });
//         }
//     } catch (error) {
//         console.error("Error al validar token:", error);
//         return response.status(500).json({
//             message: "Internal server error",
//             status: 500,
//             ok: false, // Esto antes decía `true`, lo cual es incorrecto
//         });
//     }
// };

