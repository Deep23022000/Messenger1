const jwt = require('jsonwebtoken')


module.exports.authMiddleware = async( req,res,next) =>{
    const {authToken} = req.cookies
    if(authToken){
        const deCodedToken = await jwt.verify(authToken,process.env.SECRET)
        req.myId = deCodedToken.user_id;
        // console.log(authToken)
        next()
    }
    else{
        res.status(400).json({
            error:{
                errorMessage: ['Please Login']
            }
        })
    }
   
}

