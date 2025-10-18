const controller = require("../controller/controller")
const express = require("express")
const router = express.Router()


router.post("/signUp",controller.registerUser)
