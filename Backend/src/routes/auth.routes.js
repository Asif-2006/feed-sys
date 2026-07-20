const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')








// const { routes } = require('../app');

const router = express.Router();


router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/logout',authMiddleware.authUser, authController.logoutUser);



module.exports = router;