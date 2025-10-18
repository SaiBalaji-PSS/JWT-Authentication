const controller = require("../controller/controller")
const express = require("express")
const router = express.Router()
const protectedRouter = express.Router()


router.post("/signUp",controller.registerUser)
router.post("/login",controller.login)

protectedRouter.get("/greet",controller.greetUser)

module.exports = {router,protectedRouter}