
import dotenv from 'dotenv';


//carga las variables de entorno en process.env
dotenv.config();


const ENVIROMENT = {
    PORT : process.env.PORT,
    MONGO_DB_URL : process.env.MONGO_DB_URL,
    SECRET_KEY_JWT : process.env.SECRET_KEY_JWT,
    GMAIL_PASSWORD : process.env.GMAIL_PASSWORD,
    GMAIL_USERNAME : process.env.GMAIL_USERNAME,
    URL_BACKEND: process.env.URL_BACKEND,
    URL_FRONTEND: process.env.URL_FRONTEND,
    MYSQL : {
        DB_NAME: process.env.MYSQL_DB_NAME,
        USERNAME: process.env.MYSQL_USER,
        PASSWORD: process.env.MYSQL_PASSWORD,
        HOST: process.env.MYSQL_HOST
    }
}

// console.log("ENVIROMENT", ENVIROMENT);
for (let key in ENVIROMENT) {
    if (ENVIROMENT[key] === undefined) {
        console.error("OJO q la variable" + key + " esta indefinida") 
    }
}

// console.log("ENVIROMENT", ENVIROMENT);


export default ENVIROMENT;  