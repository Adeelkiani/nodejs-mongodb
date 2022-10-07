const express = require('express')
const Trade = require("../models/trade");
const { http_200, http_201, http_204, http_400, http_404, http_405, http_500 } = require("../utils/httpCodes");
const router = new express.Router()
const authMiddleware = require('../middleware/auth');

router.post('/trades', authMiddleware, async (req, res) => {
    console.log(req.body)

    const task = new Trade({
        ...req.body,
        user_id: req.user._id
    })

    try {
        await task.save()
        res.status(http_201).send(task)
    } catch (e) {
        res.status(http_400).send(e)
    }
})

router.get('/trades', authMiddleware, async (req, res) => {

    const type = req.query.type
    const user_id = req.query.user_id

    const match = {}
    const sort = {
        _id: 1
    }

    if (type) {
        match.type = type
    }

    if (user_id) {
        match.user_id = user_id
    }

    try {
        const trades = await Trade.find(match)
            .sort(sort)

        if (trades.length) {
            res.status(http_200).send(trades)
        } else {
            res.status(http_204).send()
        }
    } catch (e) {
        res.status(http_500).send(e)
    }
})

router.get('/trades/:id', authMiddleware, async (req, res) => {

    const _id = req.params.id

    try {
        const trade = await Trade.findOne({
            _id
        })

        if (!trade) {
            return res.status(http_404).send('ID not found')
        }
        res.status(http_200).send(trade)
    } catch (e) {
        res.status(http_400).send(e)
    }
})

router.patch('/trades/*', async (req, res) => { res.status(http_405).send() })
router.put('/trades/*', async (req, res) => { res.status(http_405).send() })
router.delete('/trades/*', async (req, res) => { res.status(http_405).send() })

module.exports = router