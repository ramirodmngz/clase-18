import promisePool from "../config/mysql.config.js";
import Message from "../models/Message.model.js";
import { ServerError } from "../utils/errors.util.js";
import channelRepository from "./channel.repository.js";
import workspaceRepository from "./workspace.repository.js";

class MessageRepository {

    

    // async createMessage({sender_id, channel_id, content }){

    //     const channel_found = await channelRepository.findChannelById(channel_id)
    //     if(!channel_found){
    //         throw new ServerError("channel not found", 404)
    //     }
    //     //                                                         Pongo .tostring para que la propiedad object id pase a string
    //     // const workspace_found = await workspaceRepository.findWorkspaceById(channel_found.workspace.toString()) 
    //     if(!channel_found.workspace.members.includes(sender_id)){
    //         throw new ServerError("user is not member of this workspace", 403)
    //     }

    //     const new_message = await Message.create({
    //         sender: sender_id,
    //         channel: channel_id,
    //         content: content
    //     })
    //     return new_message
    // }
    async create({sender_id, channel_id, content }){
        const queryStr = `
        INSERT INTO messages (sender, channel, content)
        VALUES (?, ?, ?)
        `
        const [result] = await promisePool.execute(queryStr, [sender_id, channel_id, content])
        const new_message = {_id: result.insertId, sender : sender_id, channel : channel_id, content}
        return new_message
    }

    // async findMessagesFromChannel({channel_id, user_id}){
    //     const channel_found = await channelRepository.findChannelById(channel_id)
    //     if(!channel_found){
    //         throw new ServerError("channel not found", 404)
    //     }

    //     if(!channel_found.workspace.members.includes(user_id)){
    //         throw new ServerError("user is not member of this workspace", 403)
    //     }
    //     // if(!channel_found.workspace.members.includes(user_id)){
    //     //     throw new ServerError("user is not member of this workspace", 403)
    //     // }
    //     // const messagesList = await Message.find({channel: channel_id}).populate("sender", "username email")
    //     const messagesList = await Message.find({channel: channel_id})
    //     .populate("sender", "username")
    //     // .populate("channel")
    //     return messagesList
    // }
    async findMessagesFromChannel({channel_id, user_id}){
        
        /* 
        queremos obtner de la tabla de mensajes 
        _id
        content
        created_at
        queremos obtener de la tabla de usuarios 
        username
        [
            {
                _id
                content
                created_at
                sender: {
                    username
                    email
                }
            }
        ]
        */
        const queryStr = `
        SELECT 
            messages._id,
            messages.content,
            messages.created_at,
            users.username
        FROM messages
        JOIN users ON messages.sender = users._id
        WHERE messages.channel = ?
        ORDER BY messages.created_at ASC
        `

        const [messages] = await promisePool.execute(queryStr, [channel_id])
        console.log({messages})
        return messages
    }
}

const messageRepository = new MessageRepository()

export default messageRepository

