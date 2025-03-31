export const verifyLuckyMiddleware = (request, response, next) =>{
    const random_number = Math.random()
    if(random_number > 0.5){
        //tiene suerte
        request.tiene_suerte = true
        next()
    } else {
        //no tiene suerte
        response.json({
            message : "no tenes suerte",
        })
    }
}