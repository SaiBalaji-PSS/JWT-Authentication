const db = require("../src/db/db")
const {userTable} = require("../src/db/schema")
const {eq} = require("drizzle-orm")
const {randomBytes, createHmac} = require("node:crypto")
const jwt = require("jsonwebtoken")
const SECRETKEY = "KudoConan"
const registerUser = async (req,res) => {
    const {userName,email,password} = req.body
    if(!userName || !email || !password){
        return res.status(403).json({isSuccess:false,message:"Invalid username/email/password"})
    }
    try{
        //check if the user already exist in the db 
       const existingUser =  await db.select({email:userTable.email})
                              .from(userTable)
                              .where(eq(userTable.email,email))
        if(existingUser.length > 0){
            return res.status(403).json({isSuccess:false,message:`The user with email ${existingUser[0].email} already exist`})
        }
        //user is not there so create new entry in DB

        //generate hash for the password
        const salt = randomBytes(256).toString("hex")
        const hashedPassword = createHmac("sha256",salt).update(password).digest("hex")

        //insert the user into db userTable
        const newUserData = {
            userName:userName,
            email:email,
            salt:salt,
            hashedPassword:hashedPassword
        }
        const [insertedUser] = await db.insert(userTable).values(newUserData).returning({insertedId:userTable.id})

         //generate JWT token(base64HEADER.base64PAYLOAD.base64SIGNATURE) with the payload as inserted user's uuid  from db
        const token = jwt.sign({id:insertedUser.insertedId},SECRETKEY,{expiresIn:"360h"})
        //Send it to the client the client is now authenticated
        res.status(201).json({isSuccess:true,message:`The user with id ${insertedUser.insertedId} has been created successfully`})

    }
    catch(error){
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Internal server error"})
    }
}



const login = async (req,res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(403).json({isSuccess:false,message:"Invalid email or password"})
    }
    try{

       


         //check if the email password matches with the db data - returns an array
         
        const [existingUser] = await db.select()
                                              .from(userTable)
                                              .where(eq(userTable.email,email))
        if(!existingUser){
            return res.status(403).json({isSuccess:false,message:"Invalid email"})
        }
          //generate hash for password in body and compare it with hash in db 
           const hashedBodyPassword = createHmac("sha256",existingUser.salt).update(password).digest("hex")
           if(hashedBodyPassword != existingUser.hashedPassword){
             return res.status(403).json({isSuccess:false,message:"Invalid password"})
           }

        //generate token for the user 
        const token = jwt.sign({id:existingUser.id},SECRETKEY,{expiresIn:"360h"})
        //The user is authenticated send the token to the client 
        res.status(200).json({isSuccess:true,message:"User authenticated successfully",token:token})
   
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
    

}

module.exports = {registerUser,login}