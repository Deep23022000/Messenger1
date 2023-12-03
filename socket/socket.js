const io= require('socket.io')(8000,{
    cors : {
        origin : '*',
        methods : ['GET', 'POST']
    }
})

let users = []

 const addUser = (userId, socketId , userInfo) => {

    const checkUser = users.some( u => u.userId === userId)

    if(!checkUser){
        if(userInfo){
            users.push({userId, socketId, userInfo})
        }
        
    }
 }


const findFriend = (recieverId) => {
   console.log(recieverId)
   console.log(users)
    return users.find( u =>  ( u.userId === recieverId))
    
    
}
const userRemove = ( socketId ) => {
    users = users.filter( u => u.socketId !== socketId)
}

const userLogout = (userId) => {
    users = users.filter( u => u.userId !== userId)
}

io.on('connection', (socket) => {
    console.log('socket connected')

    socket.on('addUser', (userId, userInfo) =>{

    //     console.log(userId)
    // console.log(userInfo)

    addUser(userId, socket.id, userInfo )

        io.emit('getUsers', users)

        const us = users.filter(u=>u.userId !== userId);
        const con = 'new_user_add';
        for(var i = 0; i <us.length; i++ ){
             socket.to(us[i].socketId).emit('new_user_add',con);
        }
   
   
    })

    socket.on('sendMessage',(data) => {
        console.log(data)
        const user = findFriend(data.recieverId) 
        console.log(user)

        if(user !== undefined){
            socket.to(user.socketId).emit('getMessage', data)
       }
    })

    socket.on('messageSeen',msg =>{
        const user = findFriend(msg.senderId);          
        if(user !== undefined){
             socket.to(user.socketId).emit('msgSeenResponse', msg)
        }          
   })

   socket.on('deliveredMessage',msg =>{
        const user = findFriend(msg.senderId);          
        if(user !== undefined){
             socket.to(user.socketId).emit('msgDeliveredResponse', msg)
        }          
   })

   socket.on('seen',data =>{
    const user = findFriend(data.senderId);          
    if(user !== undefined){
         socket.to(user.socketId).emit('seenSuccess', data)
    } 
})

    socket.on('typeMessage', (data) => {
        
        const user = findFriend(data.recieverId) 
        

        if(user !== undefined){
            socket.to(user.socketId).emit('typeMessageGet',{
                 senderId : data.senderId,
                 senderName :  data.senderName,
                 recieverId :  data.recieverId,
                 createAt : data.time,
                 message : {
                      text : data.message.text,
                      image : data.message.image
                 }
            })
       }
    })

    socket.on('logout', (userId) =>{
        userLogout(userId)
    })

    socket.on('disconnect', () => {
        console.log('disconnecting..')
        userRemove(socket.id)
        io.emit('getUsers', users)
    })
})

