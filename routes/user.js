const express = require('express')
const router = express.Router()
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check_auth')

// total get user
router.get('/', async (req, res) => {

    try{
        const users = await userModel.find()

        res.status(200).json({
            msg : "get users",
            count : users.length,
            userInfo : users.map(user => {

                return {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get user
router.get('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findById(id)

        if(!user){
            return res.status(402).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "get user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// signup
router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body

    try{
        const user = await userModel.findOne({email})

        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.status(200).json({
                msg : "success signup",
                userInfo : {

                    id: user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    const { email, password } = req.body

    const result = {status : 'success'}

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {

                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn : '1h'}
                    )

                    res.status(200).send(result)
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// total delete user
router.post('/deleteAll', async (req, res) => {

    try{
        await userModel.remove()

        res.status(500).json({
            msg : "delete users"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete user
router.post('/delete/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove(id)

        if(!user){
            return res.status(402).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete user by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router