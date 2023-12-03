const mongoose = require('mongoose')

const databaseConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    }).then(() => {
    console.log("Mongodb is connected")
}).catch( (err) => {
        console.error(err)
    })
}

module.exports = databaseConnect;