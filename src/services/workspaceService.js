import workspaceRepository from "../repositories/workspace.repository.js"
import { ServerError } from "../utils/errors.util.js"

class WorkspaceService {
    async createWorkspace({name, owner_id}){
        console.log(owner_id)
        const workspace_created = await workspaceRepository.createWorkspace({name, owner_id})
        await workspaceRepository.addNewMember({workspace_id : workspace_created.workspace_id, member_id: owner_id})
        return workspace_created
    }

    async addMember(workspace_id, member_id, owner_id){
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id)
        const isMember = await workspaceRepository.isUserMemberOfWorkspace({workspace_id, user_id: member_id})

        if(!workspace_found){
            throw new ServerError("Workspace not found", 404)
        }
        if(isMember){
            throw new ServerError("User already member of this workspace", 400)
        }
        if(workspace_found.owner !== owner_id){
            throw new ServerError("You are not the owner of this workspace", 403)
        }

        await workspaceRepository.addNewMember({workspace_id, member_id})

        return workspace_found

    }
}

const workspaceService = new WorkspaceService()

export default workspaceService