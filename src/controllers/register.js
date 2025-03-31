import { ServerError } from "../utils/errors.util.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENVIROMENT from "../config/enviroment.config.js";
import { sendMail } from "../utils/mailer.utils.js";
import userRepository from "../repositories/user.repository.js";



export const register = async (req, res) => {
    try {
        const { username, 
            email, 
            password, 
            profile_image_base64 
        } = req.body;


        if (!username) {
            throw new ServerError("username is required", 400);
        }
        if (!email) {
            throw new ServerError("email is required", 400);
        }
        if (!password) {
            throw new ServerError("password is required", 400);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        //JSON WEB TOKEN que es un JSON pasado a string 

        const verification_token = jwt.sign(
            {email}, //lo q queremos guardar en el token
            ENVIROMENT.SECRET_KEY_JWT, //clave con la que vamos a firmar
            {expiresIn: "24h"}
        );

        
        await UserRepository.create({username, email, password: passwordHash, verification_token, profile_image_base64});
        //le vamos a mandar un mail al usuario 
        //el mail va a ser un link 
        //<a href="http://localhost:3000/api/auth/verifyEmail?verification_token=asadasdasdasdasdsasd" >verificar email</a>

        await sendMail({
            to: email,
            subject: "valida tu mail",
            html: `<h1>valida tu mail para entrar en nuestra pagina</h1>
            <p>esta validacion es para que puedas entrar en nuestra pagina</p>
            <a href="${ENVIROMENT.URL_BACKEND}/api/auth/verify-email?verification_token=${verification_token}" >verificar email</a>
            `

        })

        return res.status(201).send(
            
        {
            message: "usuario registrado correctamente",
            status: 201,
            ok: true
        }
        );
    } catch (error) {
        console.log("error al registrar", error);


        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }


        res.status(500).send({ 
            status: 500,
            ok: false, 
            message: "internal server error"});
    }
    }  


    export const verifyEmailController = async (req, res) => {
        try {
            const { verification_token } = req.query;
            const payload =jwt.verify(verification_token, ENVIROMENT.SECRET_KEY_JWT)
            const {email} = payload
            const user_found = await UserRepository.verifyUserByEmail(email, verification_token)
            res.redirect(ENVIROMENT.URL_FRONTEND + "/login") 
            
        }
        catch (error) {
            console.log("error al registrar", error);
    
    
            if (error.status) {
                return res.send({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            }
    
    
            res.send({ 
                status: 500,
                ok: false, 
                message: "internal server error"});
        }
    }




    export const AUTHORIZATION_TOKEN_PROPS= {
        ID: "id",
        USERNAME: "username",
        EMAIL: "email"
    }



    export const loginController = async (req, res) => {
        try{
            console.log(req.tiene_suerte)
            const { email, password } = req.body
            const user_found = await UserRepository.findUserByEmail(email)
            if(!user_found){
                throw new ServerError("user not found", 404)
            }
            if(!user_found.verified){
                throw new ServerError("user not verified", 400)
            }
            const isSamePassword = await bcrypt.compare(password, user_found.password)
            if (!isSamePassword) {
                throw new ServerError("password incorrect", 400)
            }
            const authorization_token = jwt.sign(
                {
                    [AUTHORIZATION_TOKEN_PROPS.ID]: user_found._id,
                    [AUTHORIZATION_TOKEN_PROPS.USERNAME]: user_found.username,
                    [AUTHORIZATION_TOKEN_PROPS.EMAIL]: user_found.email
                },
                ENVIROMENT.SECRET_KEY_JWT,
                {expiresIn: "2h"}
            )
            return res.json({
                ok: true,
                status: 200,
                message: "user logged in",
                data:{
                    username : user_found.username,
                    authorization_token
                }
            })

        }
        catch (error) {
            console.log("error al registrar", error);
    
    
            if (error.status) {
                return res.send({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            }
    
    
            res.send({ 
                status: 500,
                ok: false, 
                message: "internal server error"});
        }
    }

    export const resetPasswordController = async (req, res) =>{
        try{
            const {email} = req.body
            const user_found = await UserRepository.findUserByEmail(email)
            if(!user_found){
                throw new ServerError("User not found", 404)
            }
            if(!user_found.verified){
                throw new ServerError("User email is not validated yet", 400)
            }
    
            const reset_token = jwt.sign({email, _id: user_found._id}, ENVIROMENT.SECRET_KEY_JWT, {expiresIn: '2h'})
            await sendMail({
                to: email, 
                subject: "Reset your password",
                html: `
                <h1>Has solicitado resetar tu contraseña de no ser tu ignora este mail</h1>
                <a href='${ENVIROMENT.URL_FRONTEND}/rewrite-password?reset_token=${reset_token}'>Click aqui para resetear</a>
                `
            })
            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Reset mail sent'
                }
            )
        }
        catch (error) {
            console.log("error al registrar", error);
    
            if (error.status) {
                return res.send({
                    ok: false,
                    status: error.status,
                    message: error.message
                });
            }
    
            res.send({
                status: 500,
                ok: false,
                message: "internal server error"
            });
        }
    }
    
    export const rewritePasswordController = async (req, res) => {
        try {
            const { password, reset_token } = req.body
            const { _id } = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY_JWT)
    
            // Hashear la pwd
            const newHashedPassword = await bcrypt.hash(password, 10)
            await UserRepository.changeUserPassword(_id, newHashedPassword)
            if('pepe123' === 'pepe123 '){
                
            }
            
            return res.json({
                ok: true,
                message: 'Password changed succesfully',
                status: 200
            })
    
    
        } catch (err) {
            console.log(err);
            if (err.status) {
                return res.send({
                    ok: false,
                    status: err.status,
                    message: err.message
                })
            }
            return res.send({
                message: "Internal server error",
                status: 500,
                ok: true
            })
        }
    }
