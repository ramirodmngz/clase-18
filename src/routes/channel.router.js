import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createChannelController, getMessagesListFromChannelController, sendMessageToChannelController } from "../controllers/channelController.js";


const channelRouter = Router();

//crear canal 
//body : {name : "general"}
//header : "authorization": "Bearer {authorization_token}"
//checkear que el usuario que quiera crear un canal este incluido como miembro del workspace
channelRouter.post("/:workspace_id", authMiddleware, createChannelController)

//enviar mensaje al canal
channelRouter.post ("/:channel_id/messages", authMiddleware, sendMessageToChannelController)

channelRouter.get("/:channel_id/messages", authMiddleware, getMessagesListFromChannelController)


export default channelRouter;