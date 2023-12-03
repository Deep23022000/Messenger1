const userModel = require('../models/userModel') 
const messageModel = require('../models/messegeModel') 
const formidable = require('formidable')
const fs= require('fs')

const getLastMessage = async(myId, friendId) => {
    const lastMessage = await messageModel.findOne({
        $or : [{
            $and : [{ senderId : { $eq: myId}}, { recieverId : { $eq : friendId}}
            ] },{
        $and : [{ senderId : { $eq: friendId}}, { recieverId : { $eq : myId}}
        ]
    }]
    }).sort({ updatedAt : -1})
        
    return lastMessage
}

module.exports.userFriends = (async(req,res) => {

    const myId= req.myId
    // console.log(myId)

    let friend_msg = []

   try{
    const friends = await userModel.find({
        _id: { $ne : myId }
    })
   
    for(let i = 0; i< friends.length; i++){
        let lastMsg = await getLastMessage(myId, friends[i].id)
    //    console.log(friends[i].id)
        friend_msg = [...friend_msg,{
            friendInfo : friends[i],
            lastMessage : lastMsg
        }]
        // console.log(friend_msg)
    }
    
   // const filter = friends.filter( data => data.id !== myId )
    res.status(200).json({
        success : 'success',
        friends : friend_msg
   })
    } catch{
        res.status(500).json({
            error: {
                errorMessage : 'Invalid server error'
            }
        })
    }
   
})

module.exports.messageUploadDB = async(req,res) => {
    const senderId = req.myId
    const { senderName, recieverId, message } = req.body
   
    try{ 
        const insertedMessage = await messageModel.create({
        senderId,
        senderName,
        recieverId,
        message: {
            text: message,
            image : ''
        }
    })
    res.status(200).json({
        success: true,
        message : insertedMessage
    })
    }catch(error){
        res.status(500).json({
            error: {
                errorMessage : 'Invalid server error'
            }
        })
    }
}

module.exports.messageGet = async(req,res) => {
    const myId = req.myId
    const friendId = req.params.id   
    try{ 
        let getAllMessage = await messageModel.find({
            $or : [{
                $and : [{ senderId : { $eq: myId}}, { recieverId : { $eq : friendId}}
                ] },{
            $and : [{ senderId : { $eq: friendId}}, { recieverId : { $eq : myId}}
            ]
        }]
        })

        // getAllMessage = getAllMessage.filter(message => message.senderId === myId && message.recieverId === friendId 
        //     || message.recieverId === myId && message.senderId === friendId 
        //     )
    res.status(200).json({
        success: true,
        message : getAllMessage
    })
    }catch(error){
        res.status(500).json({
            error: {
                errorMessage : 'Invalid server error'
            }
        })
    }
}

module.exports.imageMessageSend = (req,res) =>{
    const form = formidable()
    const senderId= req.myId

    form.parse(req, async (err, fields, files) => {
    // console.log(files)
    // console.log(fields)
    const {
        senderName,
        recieverId,
        imageName
    }= fields

    const newPath = __dirname + `../../../frontend/public/image/${imageName}`
    files.image.originalFilename = imageName
    try{
        fs.copyFile(files.image.filepath, newPath, async(err) => {
            if(err){
                res.status(500).json({
                    error : {
                         errorMessage: 'Image upload fail'
                    }
                })
            }
            else{
                const insertMessage = await messageModel.create({
                    senderId : senderId,
                    senderName : senderName,
                    recieverId : recieverId,
                    message : {
                         text: '',
                         image : files.image.originalFilename
                    }
               })
               res.status(201).json({
                    success : true,
                    message: insertMessage
               })
            }
        })
        }catch (error){
            res.status(500).json({
                 error : {
                      errorMessage: 'Internal Sever Error'
                 }
            })
        }

    })
}

module.exports.seenMessage = async(req, res) => {
    
    const messageId = req.body._id

    await messageModel.findByIdAndUpdate( messageId, {
        status : 'seen'
    })
    .then( () => {
        res.status(200).json({
            success : true
        })
    })
    .catch(() => {
        res.status(200).json({
            error : {
                errorMessage : 'Internal Server Error'
            }
        }) 
    })

}

module.exports.deliveredMessage = async(req, res) => {
    
    const messageId = req.body._id

    await messageModel.findByIdAndUpdate( messageId, {
        status : 'delivered'
    })
    .then( () => {
        res.status(200).json({
            success : true
        })
    })
    .catch(() => {
        res.status(200).json({
            error : {
                errorMessage : 'Internal Server Error'
            }
        }) 
    })

}