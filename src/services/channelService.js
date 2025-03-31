import channelRepository from "../repositories/channel.repository.js"
import workspaceRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/errors.util.js"

class ChannelService {
    async createChannel({name, workspace_id, user_id}){
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id)
        if(!workspace_found){
            throw new ServerError("workspace not found", 404)
        }
        if(!workspaceRepository.isUserMemberOfWorkspace({workspace_id, user_id})){
            throw new ServerError("user not in workspace", 403)
        }

        const new_channel = await channelRepository.createChannel({name, workspace_id, user_id})
        return new_channel
    }
}

const channelService = new ChannelService()

export default channelService