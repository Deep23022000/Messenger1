import React,{ useEffect, useState, useRef } from 'react';
import { FaEllipsisH,FaEdit,FaSistrix,FaSignOutAlt } from "react-icons/fa";
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import { useDispatch, useSelector } from 'react-redux'
import { messageSend, userFriends, getMessage, ImageMessageSend ,seenMessage,deliveredMessage,getTheme,themeSet } from '../actions/FriendsAction';
import {io} from 'socket.io-client'
import toast,{Toaster} from 'react-hot-toast'
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import { userLogout } from '../actions/LoginAction';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER_SUCCESS } from '../constants/RegisterConstants';

const Messenger = () => {
  
     const dispatch = useDispatch()
     const scrollRef = useRef()
     const socket = useRef()
     const navigate = useNavigate()

     const [notificationSPlay] = useSound(notificationSound);   
     const [sendingSPlay] = useSound(sendingSound); 

     const [ currentFriend, setCurrentFriend ] = useState('')
     const [newMessage,SetNewMessage] = useState('')
     const [typeMessage,SetTypeMessage] = useState('')
     const [activeUsers,SetActiveUsers] = useState([])
     const [socketMessage,SetSocketMessage] = useState('')
     const [hide,setHide] = useState(true)
     
     const {  message,messageSendSuccess, message_get_success, themeMood} = useSelector( state => state.sendMessage)
     const { friends,new_user_add} = useSelector( state => state.Friends )
     const { myInfo } = useSelector( state => state.UserRegister)
     const { authenticate } = useSelector( state => state.userLogin)
    
     // console.log(myInfo)
     // console.log(currentFriend)
     useEffect(() => {
          socket.current = io('ws://localhost:8000')
          socket.current.on('getMessage', (data) => {
              
               SetSocketMessage(data)
          })

          socket.current.on('typeMessageGet', (data) => {
               // console.log(data)
               SetTypeMessage(data)
          })

                    socket.current.on('msgSeenResponse', msg => {
               dispatch({
                    type : 'SEEN_MESSAGE',
                    payload : {
                         messageInfo : msg
                    }
               })
          })

          socket.current.on('msgDeliveredResponse', msg => {
               dispatch({
                    type : 'DELIVERED_MESSAGE',
                    payload : {
                         messageInfo : msg
                    }
               })


          })
          socket.current.on('seenSuccess', data => {
               dispatch({
                    type : 'SEEN_ALL',
                    payload : data
               })
          })
               },[])

          useEffect(() =>{
               if(authenticate){
                    dispatch(userFriends())
                    
               }
          },[authenticate])
    
     useEffect(() => {
         
          dispatch(userFriends())
          dispatch({type:'NEW_USER_ADD_CLEAR'})
     },[new_user_add])

     useEffect(() => {
          // console.log(friends)
                if(friends && friends.length>0){
                     setCurrentFriend(friends[0].friendInfo)
                }
      
               
           },[friends])
     

      useEffect(() => {
          
          dispatch(getMessage(currentFriend._id))
         
          SetTypeMessage('')
         
     },[currentFriend?._id])
     

     // console.log(typeMessage)

    

     useEffect(() =>{

          if(socketMessage && currentFriend){
               if(socketMessage.senderId === currentFriend._id && socketMessage.recieverId === myInfo.user_id){
                    // console.log("socketing")
                    dispatch({
                         type: 'SOCKET_MESSAGE_SUCCESS',
                         payload : {
                              message : socketMessage
                         }
                    })
               }
               dispatch(seenMessage(socketMessage))
               socket.current.emit('messageSeen',socketMessage);
               dispatch({
                    type: 'USER_MESSAGE_SEND',
                    payload :{
                         messageInfo : socketMessage,
                         status : 'seen'
                    } 
               })
               

          }
          dispatch(getMessage(currentFriend._id))
          SetSocketMessage('')
     },[socketMessage])

    

     



     useEffect(() =>{

               if(socketMessage && socketMessage.senderId !== currentFriend._id && socketMessage.recieverId === myInfo.user_id){
                    notificationSPlay();
                    toast.success(`${socketMessage.senderName} send a new messege`)
                    dispatch(deliveredMessage(socketMessage))
                    socket.current.emit('deliveredMessage',socketMessage);
                    dispatch({
                         type: 'USER_MESSAGE_SEND',
                         payload :{
                              messageInfo : socketMessage,
                              status : 'delivered'
                         } 
                    })
               }
          
     
},[socketMessage])



     useEffect(() => {
          
          socket.current.emit('addUser', myInfo.user_id, myInfo)
     },[])

     useEffect(() => {
          socket.current.on('getUsers', users => {
               // console.log(users)
              
               const filterUser = users.filter(u => u.userId !== myInfo.user_id )
               SetActiveUsers(filterUser)

               socket.current.on('new_user_add',data => {
                    dispatch({
                         type : 'NEW_USER_ADD',
                         payload : {
                              new_user_add : data
                         }
                    })
               })
               
          })
          
     },[])

     
    
     const changeHandler=(event)=>{
          
               SetNewMessage(event.target.value)
               socket.current.emit('typeMessage',{
                    senderId: myInfo.user_id,
                    senderName: myInfo.username,
                    recieverId: currentFriend._id,
                    time: new Date(),
                    message : {
                         text : event.target.value ? event.target.value : '',
                         image : ''
                    }
               })
              
               
      }
     //  console.log(newMessage)
      

      const clickHandler= (e) => {
        
         e.preventDefault()
          // console.log("clicked")
          sendingSPlay();
               const data= {
                    senderName: myInfo.username,
                    recieverId: currentFriend._id,
                    message: newMessage ? newMessage : '❤',
               }
             
               

               socket.current.emit('typeMessage',{
                    senderId: myInfo.user_id,
                    senderName: myInfo.username,
                    recieverId: currentFriend._id,
                    time: new Date(),
                    message : {
                         text : '',
                         image : ''
                    }
               })
               dispatch(messageSend(data))
               dispatch(getMessage(currentFriend._id))
               SetNewMessage('')
               SetTypeMessage('')
          }

          const handleEmoji = (emoji) => {
               
              
                    SetNewMessage(`${newMessage}`+emoji)
                    socket.current.emit('typeMessage',{
                         senderId: myInfo.user_id,
                         senderName: myInfo.username,
                         recieverId: currentFriend._id,
                         time: new Date(),
                         message : {
                              text : emoji,
                              image : ''
                         }
                    })
                }

          const handleImage = (e) => {
            

               if(e.target.files.length !== 0){
                    sendingSPlay();
               const imageName= e.target.files[0].lastModified + e.target.files[0].name
                   

                    socket.current.emit('sendMessage',{
                         senderId: myInfo.user_id,
                         senderName: myInfo.username,
                         recieverId: currentFriend._id,
                         time: new Date(),
                         message : {
                              text : '',
                              image : imageName
                         }
                    })

                    const formData = new FormData()

                    formData.append("imageName",imageName)
                    formData.append("senderName",myInfo.username)
                    formData.append("recieverId",currentFriend._id)
                    formData.append("image",e.target.files[0])
                    
                   dispatch(ImageMessageSend(formData))
                 /// dispatch(getMessage(currentFriend._id))
                    e.preventDefault()
               }

          }
          useEffect(() => {
               // console.log("message")
               // console.log(message)
               if(messageSendSuccess  ){
                  
                    socket.current.emit('sendMessage',message[message.length-1])

                    dispatch({
                         type: 'USER_MESSAGE_SEND',
                         payload :{
                              messageInfo : message[message.length-1]
                         } 
                    })
                    dispatch({
                         type: 'MESSAGE_SEND_SUCCESS_CLEAR'
                    })
                    
               }
               //dispatch(getMessage(currentFriend._id))
     
          }, [messageSendSuccess,])

          const logout = () => {
               
               dispatch(userLogout())
               socket.current.emit('logout',myInfo.user_id)
             
               
          }
          useEffect(() =>{
               if(!authenticate){
                    navigate('/messenger/login')
                   }
          },[authenticate])
          

        
          useEffect(() => {
               if(message.length > 0){
                    if(message[message.length -1].senderId !== myInfo.user_id && message[message.length -1].status !== 'seen'){

                         if(friends.length > 0){
                              dispatch({
                                   type: 'UPDATE',
                                   payload : {
                                        id : currentFriend._id
                                   }
                              })
                         }

                         socket.current.emit('seen', { senderId: currentFriend._id, recieverId: myInfo.user_id })
                         dispatch(seenMessage({ _id: message[message.length -1]._id }))
                   }
               }
               dispatch ({
                    type: 'MESSAGE_GET_SUCCESS_CLEAR'
               })
    
          },[ message_get_success]);
  

          useEffect(() => {
               
             scrollRef.current?.scrollIntoView({behaviour : 'smooth'})
              
          },[message])

          
         
     useEffect(() => {
          dispatch(getTheme());
       },[themeMood ]);
 
       const search = (e) => {

          const getFriendClass = document.getElementsByClassName('hover-friend');
          const frienNameClass = document.getElementsByClassName('Fd_name');
          for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
              let text = frienNameClass[i].innerText.toLowerCase();
              if (text.indexOf(e.target.value.toLowerCase())> -1) {
                  getFriendClass[i].style.display = '';
              } else {
                  getFriendClass[i].style.display = 'none';
              }
          }
      }

//     console.log(message)
// console.log(currentFriend)
     return (

       <div className={themeMood === 'dark' ? 'messenger theme' : 'messenger' }>
          <Toaster
            position={'top-center'}
            reverseOrder = {false}
            toastOptions={{
                 style : {
                      fontSize : '18px'
                 }
            }}

            />
<div className='row'>
     <div className='col-3'>
          <div className='left-side'>
               <div className='top'>
                    <div className='image-name'>
                         <div className='image'>
                              <img src= {`image/${myInfo.image}`} alt='' />
                         </div>
                         <div className='name'>
                         <h3> { myInfo.username }</h3>
                         </div>
                       </div>
                       <div className='icons'>
                            <div onClick={() => setHide(!hide)} className='icon'>
                              <FaEllipsisH />
                            </div>

                            <div className='icon'>
                                  <FaEdit/> 
                            </div>

                         <div>
                         <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                   <h3>Dark Mode</h3>

                                   <div className='on'>
                                   <label htmlFor='dark'>ON</label>
                                        <input type='radio' value='dark' name = 'theme' id = 'dark'
                                         onChange={(e) => dispatch(themeSet(e.target.value)) } >
                                         </input>
                                   </div>

                                   <div className='of'>
                                   <label htmlFor='white'>OFF</label>
                                        <input type='radio' value='white' name = 'theme' id = 'white'
                                         onChange={(e) => dispatch(themeSet(e.target.value)) } >
                                         </input>
                                   </div>

                                   <div className='logout' onClick={logout}>
                                        <div><FaSignOutAlt />Logout</div>
                                   </div>

                              </div>
                         </div>
                            

                       </div>

                       
               </div>
               <div className='friend-search'>
                    <div className='search'>
                    <button> <FaSistrix /> </button>
                    <input onChange={search} type="text" placeholder='Search' className='form-control' />
                    </div>
               </div>

               {
                activeUsers && activeUsers.length>0?        
              <div>
              <div className='active-friends'>
               <div className='active-friend' >
               <div className='image-active-icon'>
               
                   <div>{console.log(activeUsers)}</div>
                        { activeUsers && activeUsers.length>0 ?
                         activeUsers.map((user) =>{
                         
                             return (<ActiveFriend keys={user.userId} user={user} setCurrentFriend={setCurrentFriend} />)
                              
                         })
                         :""
                    }
                    
                    </div>
                   </div> 
               </div>
               </div>
                :""
                    } 
               <div className='friends'>
                    {/* {console.log(friends)} */}
               {    
                    friends && friends.length>0 ? friends.map((friend) =>  <div 
                    className={currentFriend && currentFriend._id === friend.friendInfo._id ?
                    'hover-friend active' : 'hover-friend'}
                     onClick={()=>{setCurrentFriend(friend.friendInfo)}}> 
                     
                    <Friends key={friend._id} friend={friend} currentFriend={currentFriend} activeUsers={activeUsers} />
                     </div> ) : 'No Friend'
                    
               } 
               

                         
                    
               </div>
             

          </div>
       
     </div>              
     
               
                    {currentFriend && <RightSide 
                    currentFriend={currentFriend} 
                    changeHandler={changeHandler}
                    newMessage={newMessage}
                    typeMessage={typeMessage}
                    clickHandler={clickHandler}
                    printMessage = {message}
                    scrollRef={ scrollRef }
                    handleEmoji={handleEmoji}
                    handleImage={handleImage}
                    activeUsers={activeUsers}
                    message = { message}
                    /> }
               
              
            </div>
       </div>
  )
};
export default Messenger;