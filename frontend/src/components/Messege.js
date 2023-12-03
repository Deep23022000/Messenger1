import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { FaRegCheckCircle } from "react-icons/fa"

const Message = ({printMessage,currentFriend, scrollRef, typeMessage}) => {

     
     const {myInfo} = useSelector(state=>state.UserRegister);
    
  return (
     <>
       <div className='message-show'>

          
            {
               printMessage && printMessage.length > 0 ? (printMessage.map( (m, index) => 
                    m.senderId === myInfo.user_id ? (
                    <div ref={scrollRef} className='my-message' key={myInfo.user_id}>
                    <div className='image-message'>
                         
                         <div className='my-text'>
                             
                              <p className='message-text'> {m.message.text === '' ?  <img src={`/image/${m.message.image}`} />  : m.message.text} </p>
                       
                        {
                         index === printMessage.length-1 && m.senderId === myInfo.user_id ? 
                         m.status === 'seen' ? <img className='img' src={`/image/${currentFriend.image}`} alt='' /> : m.status === 'delivered' ?
                         <span><FaRegCheckCircle /></span> : <span><FaRegCheckCircle /></span> :''
                        }
                        
                         </div>
                    </div>
                    <div className='time'>
                         {moment(m.createdAt).startOf('mini').fromNow() }                      
                    </div>
                 </div>) 
                 
                 : 
                 ( <div ref={scrollRef} className='fd-message'>
                   <div className='image-message-time'>
                 
                   <img src={`./image/${currentFriend.image}`} alt='' />
                   <div className='message-time'>
                        <div className='fd-text'>
                        
               <p className='message-text'>{m.message.text === ' ' ?  <img src={`/image/${m.message.image}`} />  : m.message.text}&nbsp;&nbsp; </p>
                        </div>
                        <div className='time'>
                        {moment(m.createdAt).startOf('mini').fromNow() }             
                        </div>
                   </div>
                   </div>
              </div>
                ) )) : 
                
                <div className='friend_connect'>
                    
                    <img src={`./image/${currentFriend.image}`} alt={currentFriend.username} />
                    <h3>Connect with {currentFriend.username}</h3>
                    <span>{moment(currentFriend.createdAt).startOf('mini').fromNow() } </span>
                </div>
                
            }
               
       </div> 
            
                
{
     typeMessage &&  typeMessage.message.text && typeMessage.recieverId === myInfo.user_id? 
     <div className='typing-message'>
     <div  className='fd-message'>
                 <div className='image-message-time'>
               
                 <img src={`./image/${currentFriend.image}`} alt='' />
                 <div className='message-time'>
                      <div className='fd-text'>
                   <p className='time'>typing...</p>   
             </div>
                      
                 </div>
                 </div>
            </div>
            </div> 
            : ''
}

               
       </>
  )
};
export default Message;
  

     