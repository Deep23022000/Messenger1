import axios from 'axios'
import { FRIEND_GET_FAILURE, FRIEND_GET_SUCCESS, GET_MESSEGE_FAILURE,
     GET_MESSEGE_SUCCESS, MESSEGE_SEND_SUCCESS, THEME_GET_SUCCESS,THEME_SET_SUCCESS } from '../constants/FriendsConstant'


export const userFriends = () => async(dispatch) => {
    
    try{
        const response = await axios.get('/api/messenger/friends')
       
        dispatch({
            type: FRIEND_GET_SUCCESS,
            payload : {
                success : response.data.success,
                friends: response.data.friends,
            }

        })
    }catch(error){
        
        dispatch({
            type: FRIEND_GET_FAILURE,
            payload: error.response.data.error.errorMessage

        })
    }
}
    
export const messageSend = (data) => async(dispatch) =>{
       
    try{
        // console.log(data)
        const response= await axios.post('/api/messenger/send-message',data)
        console.log(response)
        dispatch({
            type : MESSEGE_SEND_SUCCESS,
            payload :{
                message: response.data.message
            }
        })
        
        }
    catch(error){
        
        console.log(error.response.data)
    }
}

export const getMessage= (id) => { return async(dispatch) =>{
  
   
    try{
        const response= await axios.get(`/api/messenger/get-message/${id}`)
        
      
        
        dispatch({
            type: GET_MESSEGE_SUCCESS,
            payload : {
                
                message: response.data.message,
            }

        })
    }catch(error){
        
        dispatch({
            type: GET_MESSEGE_FAILURE,
            payload: error.response

        })
    }
}}

export const ImageMessageSend = (data) => async(dispatch) =>{
       
   console.log(data)
   try{

    const config= {
        "headers" : {
             accept : "application/json",
             "Content-type" : "multipart/form-data"
            
          
        }
    }
    const response = await axios.post('/api/messenger/image-message-send',data,config);
    console.log(response.data);
    dispatch({
        type : MESSEGE_SEND_SUCCESS,
        payload :{
            message: response.data.message
        }
    })

}catch (error){
    console.log(error.response.data);

}
}


export const seenMessage = (data) => async(dispatch) =>{
    console.log(data)
       
    try{
        // console.log(data)
        const response= await axios.post('/api/messenger/seen-message',data)
        console.log(response)
        // dispatch({
        //     type : MESSEGE_SEND_SUCCESS,
        //     payload :{
        //         message: response.data.message
        //     }
        // })
        
        }
    catch(error){
        
        console.log(error.response.data)
    }
}

export const deliveredMessage = (data) => async(dispatch) =>{
    console.log(data)
       
    try{
        // console.log(data)
        const response= await axios.post('/api/messenger/delivered-message',data)
        console.log(response)
        // dispatch({
        //     type : MESSEGE_SEND_SUCCESS,
        //     payload :{
        //         message: response.data.message
        //     }
        // })
        
        }
    catch(error){
        
        console.log(error.response.data)
    }
}


export const getTheme = () => async(dispatch) => {
    const theme = localStorage.getItem('theme');
    dispatch({
         type: "THEME_GET_SUCCESS",
         payload : {
              theme : theme? theme : 'white'
         }
    })

}


export const themeSet = (theme) => async(dispatch) => {

    localStorage.setItem('theme',theme);
    dispatch({
         type: "THEME_SET_SUCCESS",
         payload : {
              theme : theme
         }
    })

}