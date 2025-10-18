const jwt = require("jsonwebtoken")
const SECRETKEY = "KudoConan"

const jwttokenValidation = (req,res,next) =>{
    
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
        return res.status(401).json({ isSuccess: false, message: "Missing or malformed token" });
    }
    const token = req.headers.authorization.split(" ")[1] //Bearer <TOKEN>
    try{
        //regenrates signature from the HEADER.PAYLOAD from the request header
        //Compares the generated signature with the signature in the request header
        //If it matches the gives the verified token 
        //If not it will throw an error 
        const decodedTokenContent =  jwt.verify(token,SECRETKEY)
        console.log(decodedTokenContent)
        console.log("Auth success")
        req.user = decodedTokenContent
        next()
    }
    catch(error){
        console.log("ONE")
        console.log(error)
        res.status(401).json({isSuccess:false,message:"Invalid token"})
    }
}

module.exports = {jwttokenValidation}