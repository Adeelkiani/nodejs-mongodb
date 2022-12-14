const jwtToken = require('jsonwebtoken')
const User = require('../models/user')

const jwtKey = 'thisismynewpassword'

const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwtToken.verify(token, jwtKey)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    } catch (error) {
        res.status(401).send({ error: 'Invalid authentication' })
    }
}

module.exports = auth