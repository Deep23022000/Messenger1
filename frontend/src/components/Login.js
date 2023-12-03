import React, { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { userLogin } from '../actions/LoginAction'
import { useAlert } from 'react-alert'
import {useDispatch, useSelector } from 'react-redux'
import { ERROR_CLEAR, SUCCESS_CLEAR } from '../constants/LoginConstants'
import { Navigate } from 'react-router-dom';
const Login = () => {

  const alert = useAlert()
const dispatch = useDispatch()
const navigate = useNavigate()

const {loading,authenticate,error,successMessage,myInfo} = useSelector( state => state.userLogin)

  const [details, setDetails] = useState({
    email : '',
    password : ''
  })

  const inputHandler = (e) => {
    const {name,value} = e.target
    setDetails({
      ...details,
      [name] : value
    })
   
  }

  const submitHandler= (e) => {
    e.preventDefault()
    const { email, password } = details
    dispatch(userLogin(details))

  }
  
  useEffect( () =>{
    console.log(authenticate)
    if(authenticate === true){
    
      navigate("/")
      
    }
    if(successMessage){
      alert.success(successMessage)
      dispatch({ type : SUCCESS_CLEAR })
    }
    if(error)
    {
      error.map(err => alert.error(err))
      dispatch({ type : ERROR_CLEAR })
    }
  },[successMessage,error])
  
  return (
    <div className="register">
      
      <div className='card'>
        <div className='card-header'>
          <h3>Login</h3>
        </div>
      

      <div className='card-body'>
        <form onSubmit = {submitHandler}>

          <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type="email" className="form-control" placeholder='Email' id="email" 
              name='email' value={details.email} onChange={inputHandler} />
          </div>

          <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type="password" className="form-control" placeholder='Password' id="password" 
              name='password' value={details.password} onChange={inputHandler}/>
          </div>
          
          <div className='form-group'>
          <input type="submit" className="btn" value="login" />
          </div>

          <div className='form-group'>
            <span><Link to="/member/register">Login your Account</Link></span>
          </div>
          
        </form>
      </div>
      </div>
    </div>
  )
}

export default Login
