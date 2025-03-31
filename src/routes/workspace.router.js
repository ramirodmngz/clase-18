import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createWorkspaceController, inviteUserToWorkspaceController } from "../controllers/workspaceController.js"


const workspace_router = Router()
workspace_router.post('/', authMiddleware, createWorkspaceController)
workspace_router.post('/workspace', authMiddleware, createWorkspaceController)
// workspace_router.post("/create-workspace", authMiddleware, createWorkspaceController)

//api/workspaces/invite/1231313131
//id al workspace q vamos a invitar 
workspace_router.post("/:workspace_id/invite/:invited_id", authMiddleware, inviteUserToWorkspaceController)
export default workspace_router