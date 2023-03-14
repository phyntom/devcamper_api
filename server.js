const express = require("express")
const dotenv = require("dotenv")

// load env vars

dotenv.config({path: "./config/.env"})

const app = express()

const PORT = process.env.PORT || 3500

const ENV = process.env.NODE_ENV

app.listen(PORT,(error)=>{ 
    if(error){
        console.error("An error occurs",error)
    }
    console.log(`server running in ${ENV} mode on ${PORT} ....`)
})