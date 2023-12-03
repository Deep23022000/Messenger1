import { USER_LOGIN_FAIL, USER_LOGIN_SUCCESS,ERROR_CLEAR, SUCCESS_CLEAR, USER_LOGOUT_SUCCESS } from '../constants/LoginConstants'
import deCodeToken from 'jwt-decode'
const UserState = {
    loading : "true",
    authenticate : "false",
    error: '',
    successMessage: '',
    myInfo: ''
} 

const tokenDecode = (token) =>{
    
    const tokenDecoded = deCodeToken(token)
    const expTime = new Date(tokenDecoded.exp*1000)
    if(new Date() > expTime){
        return null
    }
    return tokenDecoded
}

const getToken = localStorage.getItem('authToken')

    if(getToken){
       
        const getInfo = tokenDecode(getToken)
        if(getInfo){
            console.log(UserState.myInfo)

            UserState.myInfo = getInfo
            UserState.authenticate = true
            UserState.loading  = false
            
        } 
         
    }

   

export const userLoginReducer = (state= UserState, action) => {

    //console.log(action.payload)
    switch(action.type)
    {
      
        case USER_LOGIN_SUCCESS:
            
           const myInfo = tokenDecode(action.payload.token)
           return{
            ...state,
            successMessage: action.payload.successMessage,
            error : '',
            loading : false,
            authenticate : true,
            myInfo : myInfo,
        }
            
        case USER_LOGIN_FAIL:
            return{
                ...state,
                error : action.payload,
                loading : true,
                authenticate : false,
                myInfo : '',
            }
        
        case SUCCESS_CLEAR:
            return{
                ...state,
                successMessage : ''
            }

        case ERROR_CLEAR:
                return{
                    ...state,
                    error : ''
                }

        case USER_LOGOUT_SUCCESS:
            
           return{
            ...state,
            authenticate : false,
            successMessage: action.payload.successMessage,
            myInfo : '',
        }
    
        default :
        return state
    }
}