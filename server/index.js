const express = require('express')
const massive = require('massive')
require('dotenv').config()
const authCtrl = require('./controllers/authController')
const session = require('express-session')

// const checkForSession = require('../db/middleware/checkForSession')

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express()

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},
    secret: SESSION_SECRET
}))

app.post('/auth/register',  authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)


massive({
        connectionString: CONNECTION_STRING,
        ssl:{
            rejectUnauthorized: false
        }
}).then(dbInstance => {
    app.set('db', dbInstance)
    console.log('DB daddy')
    app.listen(SERVER_PORT, () => console.log(`authenticate me harder ${SERVER_PORT}`))
}) 
