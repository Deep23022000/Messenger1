const express= require("express")
const app = express()
const dotenv = require('dotenv')
const databaseConnect= require('./config/database')
const userRoutes = require('./routes/userRoutes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')


dotenv.config({
    path: 'backend/config/.env'
})

app.use(bodyParser.json())
app.use(cookieParser())


const PORT=  process.env.PORT || 5000

app.use('/api/messenger',userRoutes)

app.get("/",(req,res) => {
    res.send("Backend working")
})

databaseConnect();

app.listen(PORT,() => {
    console.log("Server is running")
})
