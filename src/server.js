import ENVIROMENT from './config/enviroment.config.js';
import express from 'express';
import authRouter from './routes/auth.router.js';
import mongoose from './config/mongoDB.config.js';
import UserRepository from './repositories/user.repository.js';
import { sendMail } from './utils/mailer.utils.js';
import cors from 'cors';
import  {authMiddleware}  from './middlewares/authMiddleware.js';
import workspace_router from './routes/workspace.router.js';
import channelRouter from './routes/channel.router.js';
import messageRepository from './repositories/message.repository.js';

const app = express()



//deshabilito la politica de cors
//si quiero q el backend sea publico
app.use (cors())
// app.use(cors(
//     {origin: "http://localhost:5173",
//     credentials: true}
// ))

//si quiero que sea reservado para cierto dominio


// app.use(cors(
//     {
//         origin: ENVIROMENT.URL_FRONTEND,
//     }
// ))

app.use(express.json(
    {
        limit: '2mb'
    }
))


//RUTA
app.use("/api/auth", authRouter)
app.use('/api/workspaces', workspace_router)
app.use("/api/channels", channelRouter)
//agregado
app.post('/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token no válido' });
        }
        res.json({ isValid: true });
    });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    // Generar el token
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

app.get("/api/test/comprar", authMiddleware, (req, res) => {
    console.log(req.user)
    res.json(
        {
            message: "producto comprado",
        }
    )
})

app.listen(ENVIROMENT.PORT, () => {
    console.log(`el servidor se esta ejecutando en http://localhost:${ENVIROMENT.PORT}`);
});


