import {  legacy_createStore as createStore, compose, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { UserRegisterReducer } from './Reducers/UserRegisterReducer'
import { userLoginReducer } from './Reducers/LoginReducer'
import { FriendsReducer,sendMessageReducer } from './Reducers/FriendsReducer'


const rootReducer = combineReducers({
    UserRegister : UserRegisterReducer,
    userLogin : userLoginReducer,
    Friends : FriendsReducer,
    sendMessage : sendMessageReducer,
})

const middleware = [thunkMiddleware]

const store = createStore( rootReducer, compose(applyMiddleware(...middleware), 
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

export default store