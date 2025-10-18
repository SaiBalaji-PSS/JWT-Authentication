const express = require("express")
const app = express()
const PORT = 8000
const {router,protectedRouter} = require("../routes/auth.routes")
const middleWare = require("../middleware/auth.middleware")
app.use(express.json())

app.use("/api/auth",router)

//do not user /api/ as it applies to all the routes below /api/api including auth
//apply token validation middleware only to routes below /api/protected/
app.use("/api/protected",middleWare.jwttokenValidation,protectedRouter)
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))