import React, { useState, useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {useDispatch, useSelector } from 'react-redux'
import { userRegister } from '../actions/registerAction'
import { useAlert } from 'react-alert'
import { ERROR_CLEAR, SUCCESS_CLEAR } from '../constants/RegisterConstants'

const Register = () => {

const alert = useAlert()
const dispatch = useDispatch()
const navigate = useNavigate()

const {loading,authenticate,error,successMessage,myInfo} = useSelector( state => state.UserRegister)


const [details,setDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: ''
  })

  const [loadImage, setLoadImage] =useState('')

 const inputHandler= (e)=> {
  
  const {name,value} = e.target
   setDetails({
    ...details,
    [name] : value,
   })
  } 

  const fileHandler = (e) => {
    if(e.target.files.length !==0)
    {
      setDetails({...details,
        [e.target.name] : e.target.files[0]
      })
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLoadImage(reader.result)
    }
    reader.readAsDataURL(e.target.files[0])
  }

  const submitHandler= (e) => {
    e.preventDefault()
    const {username, email, password , confirmPassword , image } =details
    const formdata = new FormData()
    
    formdata.append("username" , username)
    formdata.append("email" , email)
    formdata.append("password" , password)
    formdata.append("confirmPassword" , confirmPassword)
    formdata.append("image" , image)
   
    dispatch(userRegister((formdata)))

  } 
  useEffect( () =>{
    if(authenticate  ){
      console.log(authenticate)
      navigate('/')
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
          <h3>Register</h3>
        </div>
      

      <div className='card-body'>
        <form onSubmit={submitHandler}>

          <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input type="text" className="form-control" placeholder='User name' 
              id="username" name ="username" onChange={inputHandler} value={details.username} />
          </div>

          <div className='form-group'>
              <label htmlFor='email'>Email</label>
              <input type="email" className="form-control" placeholder='Email' id="email"
              name ="email" onChange={inputHandler} value={details.email}/>
          </div>

          <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input type="password" className="form-control" placeholder='Password' id="password"
              name ="password" onChange={inputHandler} value={details.password} />
          </div>

          <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input type="password" className="form-control" placeholder='Confirm Password' id="confirmPassword"
              name ="confirmPassword" onChange={inputHandler} value={details.confirmPassword}/>
          </div>

          <div className='form-group'>
              <div className='file-image'>
                <div className='image'>
                  { loadImage ? <img src={loadImage}/>: ''}
                </div>
                <div className='file'>
                  <label htmlFor='image'>Select Image</label>
                  <input type="file" className='form-control' id="image" 
                  name ="image" onChange={fileHandler} />
                </div>
              </div>
          </div>
          
          <div className='form-group'>
          <input type="submit" className="btn" value="register" />
          
          </div>

          <div className='form-group'>
            <span><Link to="/member/login">Login your Account</Link></span>
          </div>
          
        </form>
      </div>
      </div>
    </div>
  )
}

export default Register
