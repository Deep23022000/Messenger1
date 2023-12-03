import React from 'react'
import { useSelector, } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({children}) => {

  const { authenticate1 } = useSelector(state => state.UserRegister)
  const {authenticate} = useSelector(state => state.userLogin)
    console.log(authenticate)
  return (
     authenticate || authenticate1 === true ? children : <Navigate to="/messenger/login" />
     
  )
}

export default ProtectRoute
