const express = require('express')
const User = require("../models/user");
const { http_201, http_400, http_500, http_404 } = require("../utils/httpCodes");
const router = new express.Router()
const authMiddleware = require('../middleware/auth')


router.post('/users', async (req, res) => {
    console.log(req.body)

    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(http_201).send({ user, token })
    } catch (e) {

        console.log('EXCEPTION: ', e)
        res.status(http_400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(http_400).send(e.message)
    }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(http_400).send(e.message)
    }
})

router.get('/users', authMiddleware, async (req, res) => {

    try {
        const users = await User.find({})
        res.status(http_201).send(users)
    } catch (e) {
        res.status(http_500).send(e)
    }
})

router.get('/users/me', authMiddleware, async (req, res) => {
    res.send(req.user)
})


router.patch('/users/me', authMiddleware, async (req, res) => {

    //Takes object and returns array of string
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'password']
    const isValidOperation = updates.every((item) => allowedUpdate.includes(item))
    if (!isValidOperation) {
        return res.status(http_400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(http_400).send(e)
    }
})


module.exports = router