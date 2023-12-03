import React from 'react';
import { FaPhoneAlt,FaVideo,FaRocketchat } from "react-icons/fa";
import FriendInfo from './FriendInfo';
import Message from './Messege';
import MessageSend from './MessegeSend';

const RightSide = ({currentFriend, changeHandler, newMessage,  
     clickHandler, printMessage, scrollRef, message,
     handleEmoji, handleImage,activeUsers, typeMessage}) => {

          console.log(activeUsers)
  return (
       <div className='col-9'>
            <div className='right-side'>
               <input type="checkbox" id = "dot" />
                 <div className='row'>
                      <div className='col-8'>
          <div className='message-send-show'>
               <div className='header'>
                    <div className='image-name'>
                         <div className='image'>
                         <img src={`/image/${currentFriend.image}`} alt='' />
                         {
                            activeUsers &&  activeUsers.map( user => {
                                  return( user.userId === currentFriend._id ? <div className = 'active-icon'></div>: '')
                              })
                         }
                         

                         </div>
                         <div className='name'>
                        <h3> {currentFriend.username} </h3>
                        
                         </div>
                    </div>

          <div className='icons'>
     <div className='icon'>
          <FaPhoneAlt/>
     </div>

     <div className='icon'>
          <FaVideo/>
     </div>

     <div className='icon'>
          <label htmlFor='dot'><FaRocketchat/></label>
     </div>

    </div>
         </div>
         <Message currentFriend={currentFriend} printMessage={printMessage} scrollRef= { scrollRef } typeMessage={typeMessage} />
         <MessageSend changeHandler={changeHandler} newMessage={newMessage} clickHandler={clickHandler} 
         handleEmoji={handleEmoji} handleImage={handleImage} />
             </div>
                      </div>  

                 <div className='col-4'>
                    About 
                    <FriendInfo currentFriend={currentFriend} activeUsers={activeUsers} message = { message}/>
               </div>  


                 </div>
            </div>
       </div>
  )
};

export default RightSide;