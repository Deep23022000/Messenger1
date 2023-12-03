import React from 'react'

const ActiveFriend = ({user, setCurrentFriend}) => {
 


  return (
    <div>
      
       {/* <div className='active-friend' 
           onClick={() => {
         setCurrentFriend({
             _id : user.userInfo.user_id,
         })
       }}
       > */}
             {/* <div className='image-active-icon'> */}
            
            
             {/* {activeUsers && activeUsers.length >0 ? 
            activeUsers.map((user) => {  */}
                 
                 <div className ='image'  onClick={() => { setCurrentFriend({ email : user.userInfo.email,
                                                                              image : user.userInfo.image,
                                                                              username : user.userInfo.username,
                                                                               _id : user.userInfo.user_id }) }} >
               
                 <img src= {`/image/${user.userInfo.image}`} alt={user.userInfo.username}></img> 
                  <div className = 'active-icon'></div>   
                 <h5>{user.userInfo.username}</h5>
                 
                 </div>
                
                 {/* }
            
            )
            
           
            : 'No'} */}
            
             
             
            
             </div>
    //        </div>
           
     
    // </div>
  )
}

export default ActiveFriend
