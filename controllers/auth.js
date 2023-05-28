const Product = require('../models/product')
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')


exports.loginGet = (req, res, next) => {
  if (req.session.isLoggedIn == true) {
    res.redirect('/')
    console.log('logout first')
  }
  res.render('login.ejs', 
  {
    pageTitle: 'Login',
    current: 'login',
    isAuth: req.session.isLoggedIn,
    message: null,
    data: {
      email: ""
    }
  })
}


exports.loginPost = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('login.ejs', {
      pageTitle: 'Log In',
      current: 'login',
      isAuth: req.session.isLoggedIn,
      message: errors.array()[0].msg,
      data: {
        email: ""
      }
    })
  }
  User.findOne({ email: email})
  .then(user => {
    if(user) {
      return bcrypt.compare(password, user.password)
      .then((doMatch) =>{
        if (doMatch) {
          req.session.isLoggedIn = true
          req.session.user = user
          return req.session.save(err => {
            console.log(err)
            res.redirect('/')
          })
        }
        res.render('login.ejs', 
        {
          pageTitle: 'Login',
          current: 'login',
          isAuth: req.session.isLoggedIn,
          message: 'error 1 : Wrong user or password',
          data: {
            email: req.body.email
          }
        })
      })
      .catch((err) => {
        res.redirect('/500')
      })
    }
    res.render('login.ejs', 
        {
          pageTitle: 'Login',
          current: 'login',
          isAuth: req.session.isLoggedIn,
          message: 'error 1 : Wrong user or password',
          data: {
            email: req.body.email
          }
        })
  })
  .catch((err) => {
    res.redirect('/500')
  })
  // res.setHeader('Set-Cookie', 'loggedIn=yes');
}


exports.logoutPost = (req, res, next) => {
  // req.session.destroy(err => {
  //   res.redirect('/')
  //   console.log(err)
  // })
  req.session.isLoggedIn = false
  res.redirect('/')
}

exports.signupGet = (req, res, next) => {
  let errMsg = req.flash('error')
  if (errMsg.length > 0) {
    errMsg = errMsg[0]
  } else {
    errMsg = null
  }
  if (req.session.isLoggedIn == true) {
    res.redirect('/')
    console.log('logout first')
    console.log(req.session.isLoggedIn)
  } else {
    res.render('signup.ejs', 
    {
      pageTitle: 'Sign Up',
      current: 'signup',
      isAuth: req.session.isLoggedIn,
      message: errMsg
    })
  }
}

exports.signupPost = (req, res, next) => {
  // req.session.isLoggedIn = true
  // res.setHeader('Set-Cookie', 'loggedIn=yes');
  const email = req.body.email
  const password = req.body.password
  const error = validationResult(req)
  if(!error.isEmpty()) {
    console.log(error.array())
    return res.status(422).render('signup.ejs', {
      pageTitle: 'Sign Up',
      current: 'signup',
      isAuth: req.session.isLoggedIn,
      message: error.array()[0].msg,
    })
  }
  // console.log('not found')
  bcrypt.hash(password, 12)
  .then(password => {
    const user  = new User({
      email: email,
      password: password,
      cart: {items: []}
    })
    return user.save()
  })
  .then(() => {
    res.redirect('/login')
  })
  .catch((err) => {
    res.redirect('/500')
  })
}

exports.resetGet = (req, res, next) => {
  if (req.session.isLoggedIn == true) {
    res.redirect('/')
    console.log('logout first')
  }
  res.render('reset.ejs', 
  {
    pageTitle: 'Reset',
    current: 'login',
    isAuth: req.session.isLoggedIn,
  })
}