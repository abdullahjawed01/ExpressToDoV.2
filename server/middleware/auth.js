import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

async function encryptData(userData,mySecretKey, time){
    try {
        // it accepts only objects

       
    
        // 3 parameters
        // userData=> objects
        // secret keys=> mysecretkeys
        // time => in seconds

        let token = jwt.sign(userData, mySecretKey,{
            expiresIn: time
        })// string means milliseconds and if nothing its seconds

        console.log(token);
        return token
    } catch (error) {
        console.log(error);
    }
}



const authMiddleware = (req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1]

        if(!token){
            return res.status(401).json({msg:"Invalid token"})
        }
        const decoded = jwt.verify(token, process.env.SECRETKEY )
         // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error})
    }
}








export default authMiddleware;
export {encryptData}