import { FRIEND_GET_FAILURE, FRIEND_GET_SUCCESS, FRIEND_MESSAGE_SUCCESS_CLEAR, GET_MESSEGE_FAILURE, 
    GET_MESSEGE_SUCCESS, MESSAGE_SEEN_SUCCESS, MESSAGE_SEND_SUCCESS_CLEAR, MESSEGE_SEND_SUCCESS,
     SOCKET_MESSAGE_SUCCESS, USER_MESSAGE_SEND,SEEN_MESSAGE,DELIVERED_MESSAGE, 
     UPDATE, MESSAGE_GET_SUCCESS_CLEAR, SEEN_ALL, THEME_SET_SUCCESS, THEME_GET_SUCCESS } from "../constants/FriendsConstant"

const FriendsState= {
    successs : '',
    friends : [],
    friendMessage : true,
    new_user_add : ''
}
const messageState= {
    successs : false,
    message : [],
    messageSendSuccess : false,
    message_get_success : false,
    themeMood : ''
    
}


export const FriendsReducer = (state = FriendsState , action ) => {

    switch(action.type){

        case FRIEND_GET_SUCCESS:
            return {
                ...state,
                success: action.payload.success,
                friends: action.payload.friends
            }

        case FRIEND_GET_FAILURE:
            return {
                ...state,
                error: action.payload,
               
            }
            case USER_MESSAGE_SEND:
                // console.log(action.payload)
            const index = state.friends.findIndex( f => f.friendInfo._id === action.payload.messageInfo.recieverId || f.friendInfo._id === action.payload.messageInfo.senderId)
            // console.log(state.friends[index])
            state.friends[index].lastMessage = action.payload.messageInfo
            state.friends[index].lastMessage.status = action.payload.status;
                return state;
            
            case SEEN_MESSAGE :
                const ind = state.friends.findIndex( f => f.friendInfo._id === action.payload.messageInfo.recieverId || f.friendInfo._id === action.payload.messageInfo.senderId)
            // console.log(state.friends[index])
           
            state.friends[ind].lastMessage.status = 'seen';
               return{
                ...state
               }

               case DELIVERED_MESSAGE :
                const i = state.friends.findIndex( f => f.friendInfo._id === action.payload.messageInfo.recieverId || f.friendInfo._id === action.payload.messageInfo.senderId)
            // console.log(state.friends[index])
           
            state.friends[i].lastMessage.status = 'delivered';
               return{
                ...state
               }

               case UPDATE : 
               const index1 = state.friends.findIndex(f=>f.friendInfo._id === action.payload.id);
                    if(state.friends[index1].lastMessage){
                        state.friends[index1].lastMessage.status = 'seen';
                    }
                    return {
                        ...state
                    }

                   case SEEN_ALL :
                        const index2 = state.friends.findIndex(f=>f.friendInfo._id === action.payload.recieverId);
                        state.friends[index2].lastMessage.status = 'seen';
                        return {
                             ...state
                        }
                       case  'NEW_USER_ADD':
                            return{
                                 ...state,
                                 new_user_add : action.payload.new_user_add
                            }
                       
                  
                       case 'NEW_USER_ADD_CLEAR' :
                            return{
                                 ...state,
                                 new_user_add : ''
                            }
                       
               
        default:
            return state

    }
}

export const sendMessageReducer = (state = messageState , action ) => {

    switch(action.type){

        case GET_MESSEGE_SUCCESS:
            return {
                ...state,
                success: action.payload.success,
                message: action.payload.message,
                message_get_success : true,
            }

        case GET_MESSEGE_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        
        case MESSEGE_SEND_SUCCESS:
            console.log(action.payload.message.message.image)
            return {
                ...state.message,
                message : [...state.message,action.payload.message],
                messageSendSuccess : true
            }

            case SOCKET_MESSAGE_SUCCESS:
            console.log(action.payload)
            return {
                ...state.message,
                message : action.payload.message
            }

            case MESSAGE_SEND_SUCCESS_CLEAR : 
            return {
                 ...state,
                 messageSendSuccess : false,
                              
            }

          case MESSAGE_GET_SUCCESS_CLEAR :
            
          return {
                     ...state,
                     message_get_success : false
                }
           
            case THEME_GET_SUCCESS : 
                    return {
                         ...state,
                         themeMood : action.payload.theme
                    }
               
          
               
                case THEME_SET_SUCCESS : 
                    return {
                         ...state,
                         themeMood : action.payload.theme
                    }
               

        default:
            return state

    }

}

