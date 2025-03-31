
import workspaceRepository from "../repositories/workspace.repository.js"
import workspaceService from "../services/workspaceService.js"

export const createWorkspaceController = async (req, res) => {
    try {
        const { name } = req.body;
        const owner_id = req.user.id;
        // Verificar si el token está presente en la cabecera 'Authorization'
        const authorization_token = req.headers['authorization'];
        if (!authorization_token) {
            return res.status(401).json({
                ok: false,
                message: "Token no proporcionado",
            });
        }
        // Obtener el token limpio, eliminando el prefijo "Bearer"
        const token = authorization_token.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                ok: false,
                message: "Token mal formado",
            });
        }
        // Crear el workspace
        const new_workspace = await workspaceService.createWorkspace({ name, owner_id });
        console.log("Workspace creado:", new_workspace);
        // Responder con el token y el workspace
        res.status(201).json({
            ok: true,
            message: "Workspace creado",
            data: {
                new_workspace,
                authorization_token: token // Incluir el token aquí
            }
        });
    } catch (error) {
        console.log("Error al registrar:", error);
        res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
}; 



// export const createWorkspaceController = async (req, res) => {
//     try {
//         const { name } = req.body;
//         console.log(req.user); // { id: 3, username: 'ramiro12', ... }
//         const owner_id = req.user.id;
//         // Crear el workspace
//         const new_workspace = await workspaceService.createWorkspace({ name, owner_id });
//         console.log("Workspace creado:", new_workspace);
//         // Generar un nuevo token o reutilizar el actual
//         const authorization_token = req.headers['authorization']; // Tomar el token enviado por el frontend
//         // Validar el token antes de enviar
//         if (!authorization_token) {
//             return res.status(401).json({
//                 ok: false,
//                 message: "Token no proporcionado",
//             });
//         }
//         // Responder con el workspace y el token
//         res.json({
//             ok: true,
//             status: 201,
//             message: "Workspace creado",
//             data: {
//                 new_workspace,
//                 authorization_token // Enviar el token aquí
//             }
//         });
//         console.log("Respuesta completa de la API:", {
//             new_workspace,
//             authorization_token
//         });
//     } catch (error) {
//         console.log("Error al registrar:", error);
//         if (error.status) {
//             return res.status(400).send({
//                 ok: false,
//                 status: error.status,
//                 message: error.message
//             });
//         }
//         res.status(500).send({
//             status: 500,
//             ok: false,
//             message: "Error interno del servidor"
//         });
//     }
// };
// export const createWorkspaceController = async (req, res) => {
//     try {
//         const {name} = req.body
//         console.log(req.user)
//         const owner_id = req.user.id

//         const new_workspace = await workspaceService.createWorkspace({name, owner_id})
//         // const new_workspace = await workspaceRepository.createWorkspace({name, owner_id})
//         console.log(name)
//         res.json({
//             ok: true,
//             status: 201,
//             message: "workspace created",
//             data:{
//                 new_workspace
//             }
//         })
//         console.log("Respuesta completa de la API:", res);
//     } catch (error) {
//         console.log("error al registrar", error);
//         if (error.status) {
//             return res.status(400).send({
//                 ok: false,
//                 status: error.status,
//                 message: error.message
//             });
//         }
//         res.status(500).send({
//             status: 500,
//             ok: false,
//             message: "internal server error"
//         });
//     }

    
// }

export const inviteUserToWorkspaceController = async (req, res) => {
    try{
        console.log("hola", req.user)
        //e
        const user_id = req.user.id
        //a la q vamos a invitar
        const {invited_id, workspace_id} = req.params

        const workspace_found = await workspaceService.addNewMember(workspace_id, invited_id, user_id)
        // const workspace_found = await workspaceRepository.addNewMember({owner_id: user_id, invited_id, workspace_id})
        res.json({
            ok: true,
            status: 201,
            message: "user invited to workspace",
            data:{
                workspace : workspace_found
            }
        })
    } 
    catch (error) {
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
            message: "internal server error"
        });
    }
}





export default createWorkspaceController