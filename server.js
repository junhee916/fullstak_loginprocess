require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const path = require('path')
const app = express()

const userRouter = require('./routes/user')
const boardRouter = require('./routes/board')
const commendRouter = require('./routes/commend')

const connectDB = require('./config/database')
connectDB()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/publics', express.static(__dirname + '/publics'))

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan('dev'))

app.use('/user', userRouter)
app.use('/board', boardRouter)
app.use('/commend', commendRouter)

app.get('/signup', (req, res) => {

    res.render('signup')
})

app.get('/login', (req, res) => {

    res.render('login')
})

app.get('/index', (req, res) => {

    res.render('index')
})

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))