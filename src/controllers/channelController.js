import channelRepository from "../repositories/channel.repository.js";
import messageRepository from "../repositories/message.repository.js";
import channelService from "../services/channelService.js";
import messageService from "../services/messageService.js";
import { ServerError } from "../utils/errors.util.js";

export const createChannelController = async (req, res) => {
    try{
        //channel name
        const {name} = req.body
        //id del workspace al que se va a crear el canal
        const {workspace_id} = req.params
        //id del usuario que quiere crear el canal
        const user_id = req.user.id

        const new_channel = await channelService.createChannel({name, user_id, workspace_id})
        // const new_channel = await channelRepository.createChannel({name, user_id : user_id, workspace_id})
        res.json({
            ok: true,
            status: 201,
            message:"canal creado", 
            data: {
                new_channel
            }
        })
    } 
    catch (error) {
        console.log("error al crear canal", error);
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
            message: "internal server error"
        });
    }
}

export const sendMessageToChannelController = async (req, res) => {
    try{
        const {channel_id} = req.params
        const user_id = req.user.id
        const content = req.body.content
        const new_message = await messageService.create(channel_id, user_id, content)
        res.json({
            ok: true,
            message: "message sent",
            status: 201,
            data: {
                new_message
            }
        })
    } 
    catch (error) {
        console.log("error al enviar mensaje", error);
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
            message: "internal server error"
        });
    }
}   

export const getMessagesListFromChannelController = async(req, res) =>{
    try{
        const user_id = req.user.id
        const {channel_id} = req.params
        const messages = await messageService.getMessageFromChannel({channel_id, user_id})
        res.json({
            ok: true,
            status: 200,
            message: "messages found",
            data: {
                messages
            }
        })
    }
    catch (error) {
        console.log("error al obtener la lista de mensajes", error);
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
            message: "internal server error"
        });
    }
}