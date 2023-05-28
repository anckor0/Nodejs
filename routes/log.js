const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isauth = require('../auth/isauth');
const { check, body } = require('express-validator')
const User = require('../models/users')

router.get('/login', authController.loginGet);
router.post('/login', 
    [
        body('email')
            .isEmail()
            .withMessage('Please enter your email')
            .normalizeEmail(),
        body('password')
            .trim()
    ],
    authController.loginPost
);
router.post('/logout', isauth, authController.logoutPost);
router.get('/signup', authController.signupGet);
router.post('/signup', 
    check('email')
    .isEmail()
    .withMessage('Invalid Email')
    .custom((value, {req}) => {
        return User.findOne({ email: value})
        .then(result => {
            if (result) {
                return Promise.reject('E-Mail exists already, please pick a different one.')
            }
        })
    })
    .normalizeEmail(), 
    body('password', 'Your password should have only ltters and numbers').isAlphanumeric().trim(), 
authController.signupPost);
router.get('/reset', authController.resetGet);
// router.post('/reset', authController.resetPost);

module.exports = router;