import React from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment'
import { FaRegCheckCircle } from "react-icons/fa"

const Friends = ({friend, currentFriend, activeUsers }) => {

  const {myInfo} = useSelector(state=>state.UserRegister);

  const { friendInfo , lastMessage } = friend

  
// console.log(lastMessage)
 
  

  return (
    <div>
     
      <div className='friend'>
        <div className='friend-image'>
        <div className = 'image'>
      
        <img src= {`/image/${friendInfo.image}`} alt={friendInfo.username}></img>
        {
        activeUsers && activeUsers.length > 0 && activeUsers.some( u => u.userId === friendInfo._id) ? 
        <div className='active_icon'></div> : ''
     }
        </div>
      </div>
     
      <div className='friend-name-seen'>
        <div className='friend-name'>
         
            {/* <h4>{friendInfo.username}</h4> */}

            <h4 className={ lastMessage?.senderId !== myInfo.user_id && lastMessage?.status !== undefined 
              && lastMessage.status !== 'seen'?'unseen_message Fd_name ' : 'Fd_name ' } >{friendInfo.username}</h4>

           <div className = 'msg-time'>
           {
          lastMessage && lastMessage.senderId  === myInfo.user_id ? <span>You </span> : 
          <span className={ lastMessage?.senderId !== myInfo.user_id && lastMessage?.status !== undefined 
            && lastMessage.status !== 'seen'?'unseen_message ' : '' }> {friendInfo.username + ' '} </span> 
     }
     {
          lastMessage && lastMessage.message.text ? 
          <span className={ lastMessage?.senderId !== myInfo.user_id && lastMessage?.status !== undefined 
            && lastMessage.status !== 'seen'?'unseen_message ' : '' }>{lastMessage.message.text.slice(0, 10)}
            </span> : lastMessage && lastMessage.message.image ? <span>Send A image </span> : <span>Connect You </span>
     }
     <span> - &ensp;{lastMessage ? moment(lastMessage.createdAt).startOf('mini').fromNow() : moment(friendInfo.createdAt).startOf('mini').fromNow()}</span>
           </div>
        </div>
        
      

     
      {
        
        myInfo.user_id === lastMessage?.senderId ? 
           <div className = 'seen-unseen-icon'> 
           
           
           {
            lastMessage.status === 'seen' ? <img src= {`/image/${friendInfo.image}`} alt={friendInfo.username}></img> :
            lastMessage.status === 'delivered' ? <div className='delivared'><FaRegCheckCircle /></div> : 
            <div className='unseen'></div>
           }
            </div> : 
               <div className='seen-unseen-icon'>
              
            
                {
                  lastMessage?.status !== undefined && lastMessage?.status !== 'seen'? <div className='seen-icon'> </div> : ''
             }

            
               </div>
             
      }
     
     </div>
     </div>

      </div>
  
  )
}

export default Friends
