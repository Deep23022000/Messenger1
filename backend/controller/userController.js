
const formidable = require('formidable')
const validator = require('validator')
const userModel = require('../models/userModel')
const fs= require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



module.exports.userRegister = ((req, res) => {

  const form = formidable()

  form.parse(req, async (err, fields, files) => {

    const { username, email, password, confirmPassword } = fields
    const { image } = files
   
    const error = []

    if (!username) {
      error.push('Please provide your user name')
    }
    if (!email) {
      error.push('Please provide your email')
    }
    if(email && !validator.isEmail(email))
    {
      error.push('Please provide valid email id')
    }
    if (!password) {
      error.push('Please provide a password')
    }
    if (!confirmPassword) {
      error.push('Please confirm your Password')
    }
    if (password && confirmPassword && password !== confirmPassword) {
      error.push('Password not matching')
    }
    if (password && password.length < 6) {

      error.push('Password must contain atleast 6 characters')
    }
    if (Object.keys(files).length === 0) {
      error.push('Please provide your image')
    }
    if (error.length > 0) {
      res.status(400).json({
        error: {
          errorMessage: error
        }
      })
    }
    else {
      const getImageName = files.image.originalFilename
      const randNumber = Math.floor(Math.random() * 9999)
      const newImageName = randNumber + getImageName
      console.log(newImageName)
      files.image.originalFilename = newImageName

      const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`

     try{ 
      const checkUser = await userModel.findOne({
        email: email
      })

      if(checkUser)
      {
        res.status(404).json({
          error:{
            errorMessage: "User already present. Please login"
          }
        })
      }
      else{
        fs.copyFile(files.image.filepath, newPath, async(error) => {
          if(!error){
            const userCreate = await userModel.create({
              username,
              email,
              password : await bcrypt.hash(password,10),
              image : files.image.originalFilename
            })

            const token = jwt.sign(
              {
                user_id : userCreate._id,
                email : userCreate.email,
                username : userCreate.username,
                image : userCreate.image,
                registerTime: userCreate .createdAt
              },process.env.SECRET,
              {
                expiresIn: process.env.TOKEN_EXP
              }
            )
            
            const options = {expires : new Date(Date.now() +
               process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}
            

              res.status(201).cookie('authToken',token,options).json({
                successMessage : 'Registration Successful', token
               })
               console.log("success")
          }
          else{
            res.status(505).json({
              error: {
                errorMessage: "Internal Server error"
              }
            })
          }
        })
        
      }
    }
    catch{
      res.status(505).json({
        error: {
          errorMessage: "Internal Server error"
        }
      })
    }
    }
 })
})

module.exports.userLogin = (async (req,res) => {

  const email = req.body.email
  const password = req.body.password
  const error = []
  
  if (!email) {
    error.push('Please provide your email')
  }
  if(email && !validator.isEmail(email))
  {
    error.push('Please provide valid email id')
  }
  if (!password) {
    error.push('Please provide a password')
  }
  if (error.length > 0) {
    res.status(400).json({
      error: {
        errorMessage: error
      }
    })
  }else{
      try{ 
            const checkUser = await userModel.findOne({
              email: email
            }).select('+password')
              
            if(checkUser)
            { 
                const matchPassword = await bcrypt.compare(password, checkUser.password)
                if(matchPassword)
                {
                  
                  const token = jwt.sign(
                    {
                      user_id : checkUser._id,
                      email : checkUser.email,
                      username : checkUser.username,
                      image : checkUser.image,
                      registerTime: checkUser.createdAt
                    },process.env.SECRET,
                    {
                      expiresIn: process.env.TOKEN_EXP
                    }
                  )
                  
                  
                  const options = {expires : new Date(Date.now() +
                    process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)}
                  

                    res.status(200).cookie('authToken',token,options).json({
                      successMessage : 'Login Successful', token
                    })
                } else{
                  res.status(404).json({
                    error: {
                      errorMessage: "Invalid Password"
                    }
                    })
                  }
              }else{
                res.status(404).json({
                  error: {
                    errorMessage: "Email not registered"
                  }
                
                })
              }
            
            }catch{
                res.status(505).json({
                error: {
                  errorMessage: "Internal Server Error"
                }
              
            })
          }
      }
  })

  module.exports.userLogout = (req,res) => {
    res.status(200).cookie('authToken','').json({
      success : true 
    })
  }