import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/message.repository.js"
import workspaceRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/errors.util.js"

class MessageService {
    async create(channel_id, user_id, content){
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError("channel not found", 404)
        }
        const isUserMember = await workspaceRepository.isUserMemberOfWorkspace({user_id,workspace_id: channel_found.workspace})
        if(!isUserMember){
            throw new ServerError("user is not member of this workspace", 403)
        }
        const new_message = await messageRepository.create({sender_id: user_id, channel_id, content})
        return new_message
    

    }

    async getMessageFromChannel({channel_id, user_id}){
        //buscamos el canal porque tiene workspace que es el workspace_id q necesitamos
        const channel_found = await channelRepository.findChannelById(channel_id)
        if(!channel_found){
            throw new ServerError("channel not found", 404)
        }
        console.log("usuario", user_id, "workspace", channel_found.workspace)
        const isUserMember = await workspaceRepository.isUserMemberOfWorkspace({user_id,workspace_id: channel_found.workspace})
        if(!isUserMember){
            throw new ServerError("user is not member of this workspace", 403)
        }

        return await messageRepository.findMessagesFromChannel({channel_id})
    }
}

const messageService = new MessageService()

export default messageService