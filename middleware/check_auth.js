const jwt = require('jsonwebtoken')
const userModel = require('../model/user')

module.exports = (req, res, next) => {

    try{
        const token = req.headers.authorization.split(' ')[1]

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        console.log('token 정보 출력 확인: ',decode)

        console.log('token id 전달 확인: ', decode.id)

        res.locals.user = decode;

        next();

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
}