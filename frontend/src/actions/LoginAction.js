import axios from 'axios'
import { USER_LOGIN_FAIL, USER_LOGIN_SUCCESS, USER_LOGOUT_SUCCESS } from '../constants/LoginConstants'

function deleteAllCookies() {
    var c = document.cookie.split("; ");
    for ( var i in c) 
     document.cookie =/^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";    
   }
export const userLogin = (data) =>{

   console.log(data)
    return async (dispatch) =>{

        const config= {
            "headers" : {
                "Content-type" : "application/json"
            }
        }

        try {
            const response = await axios.post('/api/messenger/login',data,config)
            console.log(response.data)
            localStorage.setItem('authToken',response.data.token)

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload:{
                    successMessage : response.data.successMessage,
                    token : response.data.token
                }
            })
        } catch (error) {
            dispatch({
                type : USER_LOGIN_FAIL,
                payload: error.response.data.error.errorMessage
            })
        }
        
    }

}

export const userLogout = () => async(dispatch) => {
    console.log("logout")
    try {
        const response = await axios.post('/api/messenger/logout')

        if(response )
        {
            localStorage.removeItem('authToken')
            deleteAllCookies()
            dispatch({
                type: USER_LOGOUT_SUCCESS,
                payload:{
                    successMessage : "LOGOUT SUCCESSFULL",
                   
                }
            })
        }
        

        
    } catch (error) {
       console.log(error.response.data)
    }
}