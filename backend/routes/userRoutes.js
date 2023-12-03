const router= require('express').Router();
const {userRegister,userLogin, userLogout } = require('../controller/userController')
const {userFriends, messageUploadDB, messageGet, imageMessageSend , seenMessage, deliveredMessage} = require('../controller/friendsController')
const {authMiddleware} = require('../middleware/authMiddleware')

router.post('/login',userLogin)
router.post('/logout',authMiddleware, userLogout)
router.post('/user-register',userRegister)
router.get('/friends',authMiddleware, userFriends)
router.post('/send-message', authMiddleware,messageUploadDB)
router.get('/get-message/:id', authMiddleware,messageGet)
router.post('/image-message-send', authMiddleware,imageMessageSend)
router.post('/seen-message', authMiddleware,seenMessage)
router.post('/delivered-message', authMiddleware,deliveredMessage)


module.exports = router;