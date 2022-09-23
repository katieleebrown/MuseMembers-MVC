const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const membershipRoutes = require('./routes/membership')

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

// Method override
app.use(methodOverride('_method'))

// EJS for Views
app.set('view engine', 'ejs')

// Static Folder
app.use(express.static('public'))

// Body Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logging
app.use(logger('dev'))

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Use flash messages for errors, info, etc.
app.use(flash())

// Setup routes
app.use('/', mainRoutes)
app.use('/membership', membershipRoutes)

// Server running
app.listen(process.env.PORT, () => {
  console.log('Server is running, you better catch it!')
})    