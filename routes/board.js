const express = require('express')
const router = express.Router()
const boardModel = require('../model/board')
const checkAuth = require('../middleware/check_auth')
const board = require('../model/board')

router.get('/', checkAuth, (req, res) => {

    try{
        const result = {status : 'success', boardData : []}
        const user = res.locals.user.id
        boardModel.find({user}).exec(function(err, boards){

            if(err){
                console.log(err)
            }
            else{
                
                for(const board of boards){

                    const temp = {
                        id : board["_id"],
                        board : board["board"]
                    }

                    result["boardData"].push(temp)
                }

                res.status(200).json(result)
            }
        })

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get board
router.get('/:boardId', async (req, res) => {

    const id = req.params.boardId

    try{
        const board = await boardModel.findById(id)
                            .populate('user', ['email'])

        if(!board){
            return res.status(402).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "get board",
                boardInfo : {
                    id : board._id,
                    user : board.user,
                    board : board.board
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

// register board
router.post('/save', checkAuth, (req, res) => {

    const result = { status : 'success '}

    const user = res.locals.user.id

    console.log('save을 위한 user 정보 확인: ', user)

    const { board } = req.body

    const newBoard = new boardModel({

        user, board
    })

    try{
        newBoard.save()

        res.status(200).json(result)
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// update board
router.post('/update/:boardId', async (req, res) => {

    const id = req.params.boardId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const board = await boardModel.findByIdAndUpdate(id, {$set : updateOps})

        if(!board){
            return res.status(200).json({
                msg : "update board by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// total delete board
router.post('/delete', async (req, res) => {

    try{
        await boardModel.remove()

        res.status(200).json({
            msg : "delete boards"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete board
router.post('/delete/:boardId', async (req, res) => {

    const id = req.params.boardId

    try{
        const board = await boardModel.findByIdAndRemove(id)

        if(!board){
            return res.status(402).json({
                msg : "no boardId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete board by id: " + id
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