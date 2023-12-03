import React, { useState } from 'react';
import { FaPlusCircle,FaFileImage,FaGift,FaPaperPlane, FaSmile } from "react-icons/fa";

const MessageSend = ({changeHandler, newMessage, clickHandler, handleEmoji, handleImage}) => {

     const emojis = [
          '😀', '😃', '😄', '😁',
          '😆', '😅', '😂', '🤣',
          '😊', '😇', '🙂', '🙃',
          '😉', '😌', '😍', '😝',
          '😜', '🧐', '🤓', '😎',
          '😕', '🤑', '🥴', '😱'
      ]
      

    

  return (

     <div className='message-send-section'>
          <input type="checkbox" id='emoji' />
             <div className='file hover-attachment'>
                  <div className='add-attachment'>
                         Add Attachment
                  </div>
                  <FaPlusCircle />
                  </div>  

          <div className='file hover-image'>
               <div className='add-image'>
                    <input type='file' className='form-control' id='pic' onChange={handleImage} name='image'/> Add Image    
               </div>
               <label htmlFor='pic'> <FaFileImage/> </label>
          </div>

          <div className='file hover-gift'>
               <div className='add-gift'>
                    Add gift
               </div>
               <FaGift />
          </div>

     <div className='message-type'>
          <input type="text" name='message' id='message' placeholder='Aa' className='form-control' onChange={changeHandler} value={newMessage}/>

          <div className='file hover-gift'>
               <label htmlFor='emoji'> <FaSmile /></label>
          </div>
     </div>

     <div  onClick={clickHandler} className='file'  >
     <FaPaperPlane/>
     </div>

     <div className='emoji-section' >
          <div className='emoji'  >
               {
                    emojis.map(e => <span onClick={()=> handleEmoji(e)}>{e}</span>)
               }

          </div>

     </div>


     </div>

  )
};

export default MessageSend;