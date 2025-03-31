import mongoose from 'mongoose';
import ENVIROMENT from './enviroment.config.js';


const connectToMongoDB = async () => {
    try {
        await mongoose.connect(ENVIROMENT.MONGO_DB_URL);
        console.log("conectado a mongoDB, conectodas a la base de datos", mongoose.connection.name);
    } catch (error) {
        console.log("error al conectar a mongoDB", error);
    }
}

connectToMongoDB()

export default mongoose
