import promisePool from "../config/mysql.config.js";
import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.util.js";
class WorkspaceRepository {
    // async findWorkspaceById(id){
    //     return await Workspace.findById(id)
    // }

    async findWorkspaceById(id){
        const queryStr = `
        SELECT * FROM workspaces WHERE _id = ?
        `

        const [result] = await promisePool.execute(queryStr, [id]);
        return result[0]
    }


    // async createWorkspace({name, owner_id}){
    //     const workspace = await Workspace.create(
    //         {
    //             name, 
    //             owner: owner_id,
    //             members: [owner_id] 
    //         }
    //     )
    //     return workspace
    // }


    async addNewMembeer({workspace_id, owner_id, invited_id}){
        const workspace_found = this.findWorkspaceById(workspace_id)
        // que exista el owrkspace
        if(!workspace_found){
            throw new ServerError('Workspace not found', 404)
        }
        //que sea el dueño
        if(workspace_found.owner.equals(owner_id)){
            throw new ServerError('You are not the owner of this workspace', 403)
        }
        //que el invitado ya no sea miembro del workspace
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError('Is already a member', 400)
        }

        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    }


    async createWorkspace({name, owner_id}){
        const querytStr = `
        INSERT INTO workspaces (name, owner)
        VALUES (?, ?)
        `

        const [result] = await promisePool.execute(querytStr,[name, owner_id])
        const workspace_id = result.insertId
        return {workspace_id, owner : owner_id, members: [owner_id]}

    }
    async addNewMember({workspace_id, member_id}){

        const queryStr = `
        INSERT INTO workspace_members (workspace_id, user_id)
        VALUES (?, ?)
        `
        console.log(workspace_id, member_id)
        const [result] = await promisePool.execute(queryStr,[workspace_id, member_id])
    }



    async isUserMemberOfWorkspace({workspace_id, user_id}){
        const queryStr = `
        SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?
        `
        const [result] = await promisePool.execute(queryStr, [workspace_id, user_id])

        return result.length > 0
    }
}
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository