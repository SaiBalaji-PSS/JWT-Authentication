const db = require("../src/db/db")
const {userTable} = require("../src/db/schema")
const {eq} = require("drizzle-orm")
const {randomBytes, createHmac} = require("node:crypto")
const jwt = require("jsonwebtoken")
const SIGNUPSECRET = "KudoConan"
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
        const newUserData = {
            userName:userName,
            email:email,
            salt:salt,
            hashedPassword:hashedPassword
        }
        const [insertedUser] = await db.insert(userTable).values(newUserData).returning({insertedId:userTable.id})

        const token = jwt.sign({id:insertedUser.insertedId},SIGNUPSECRET,{expiresIn:"360h"})
        res.status(201).json({isSuccess:true,message:`The user with id ${insertedUser.insertedId} has been created successfully`,token:token})

    }
    catch(error){
        console.log(error)
        res.status(500).json({isSuccess:false,message:"Internal server error"})
    }
}
module.exports = {registerUser}