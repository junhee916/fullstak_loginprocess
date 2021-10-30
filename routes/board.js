const express = require('express')
const router = express.Router()
const boardModel = require('../model/board')

// total get board
router.get('/', async (req, res) => {

    try{
        const boards = await boardModel.find()
                            .populate('user', ['email'])

        res.status(200).json({
            msg : "get boards",
            count : boards.length,
            boardInfo : boards.map(board => {

                return {
                    id : board._id,
                    user : board.user,
                    board : board.board
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
router.post('/', async (req, res) => {

    const { user, board} = req.body

    const newBoard = new boardModel({

        user, board
    })

    try{
        const board = await newBoard.save()

        res.status(200).json({
            msg : "register board",
            boardInfo : {
                id : board._id,
                user : board.user,
                board : board.board
            }
        })
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