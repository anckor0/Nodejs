const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const database = require('./database/database')
// const mongoConnect = require('./database/database').mongoConnect
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const csrf = require('csurf')
const flash = require('connect-flash')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const logRoutes = require('./routes/log');
const errorController = require('./controllers/error');
const User = require('./models/users')
// const Session = require('./models/session')
const csrfProtection = csrf()
const multer = require('multer');


const store = new MongoDbStore({
    uri: 'mongodb+srv://arash:lCaO9XaDH3EIT1ZX@cluster0.sm8ldyj.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'session',
})

app.set("views engine", "ejs");


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, 'abcd' + file.originalname)
    }
})

const extFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
    cb(null, false)
    }
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage, fileFilter: extFilter }).single('newImage'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'abcdesfhj', resave: false, saveUninitialized: false, store: store}));
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use(csrfProtection)

app.use((req, res, next) => {
  res.locals.isAuth = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(logRoutes);

app.use(errorController.notFound);

app.use((error, req, res, next) => {
  res.redirect('/500')
  console.log(error);
})

// mongoConnect(client => {
//     app.listen(3000);
//     console.log('client')
// });

mongoose.connect('mongodb+srv://arash:lCaO9XaDH3EIT1ZX@cluster0.sm8ldyj.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
  app.listen(3000);
  })
  .then(() => {console.log('connected')})
  .catch(err => console.log(err))