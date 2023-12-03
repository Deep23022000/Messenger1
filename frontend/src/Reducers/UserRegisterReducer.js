import { ERROR_CLEAR, SUCCESS_CLEAR, USER_REGISTER_FAIL, USER_REGISTER_SUCCESS } from "../constants/RegisterConstants"
import deCodeToken from 'jwt-decode'
const UserState = {
    loading : "true",
    authenticate1 : "false",
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
            UserState.authenticate1 = true
            UserState.loading  = false
            
        } 
         
    }

   

export const UserRegisterReducer = (state= UserState, action) => {

    //console.log(action.payload)
    switch(action.type)
    {
      
        case USER_REGISTER_SUCCESS:
            
           const myInfo = tokenDecode(action.payload.token)
           return{
            ...state,
            successMessage: action.payload.successMessage,
            error : '',
            loading : false,
            authenticate1 : true,
            myInfo : myInfo,
        }
            
        case USER_REGISTER_FAIL:
            return{
                ...state,
                error : action.payload,
                loading : true,
                authenticate1 : false,
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
    
        default :
        return state
    }
}