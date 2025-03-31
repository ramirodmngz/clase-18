import express from 'express';
import { loginController, register, resetPasswordController, rewritePasswordController, verifyEmailController } from '../controllers/register.js';
import { verifyLuckyMiddleware } from '../middlewares/verifyLuckyMiddleware.js';


const authRouter = express.Router();


//ENDPOINT
authRouter.post("/register", register);
authRouter.get("/verify-email", verifyEmailController);
authRouter.post("/login", loginController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.put("/rewrite-password", rewritePasswordController);

export default authRouter;