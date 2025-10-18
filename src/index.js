const express = require("express")
const app = express()
const PORT = 8000
const router = require("../routes/auth.routes")
app.use(express.json())
app.use("/api/auth",router)
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))