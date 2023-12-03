import axios from 'axios'
import { USER_REGISTER_FAIL, USER_REGISTER_SUCCESS } from '../constants/RegisterConstants'


export const userRegister = (data) =>{

   console.log(data)
    return async (dispatch) =>{

        const config= {
            "headers" : {
                 accept : "application/json",
                 "Content-type" : "multipart/form-data"
                
              
            }
        }

        try {
            const response = await axios.post('/api/messenger/user-register',data,config)
            localStorage.setItem('authToken',response.data.token)

            dispatch({
                type: USER_REGISTER_SUCCESS,
                payload:{
                    successMessage : response.data.successMessage,
                    token : response.data.token
                }
            })
        } catch (error) {
            dispatch({
                type : USER_REGISTER_FAIL,
                payload: error.response.data.error.errorMessage
            })
        }
        
    }

}