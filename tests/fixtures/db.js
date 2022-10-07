const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Trade = require('../../src/models/trade')

const jwtKey = 'thisismynewpassword'

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Adeel',
    email: 'adeelTest@gmail.com',
    password: 'adeel123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, jwtKey)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Kiani',
    email: 'kianiTest@gmail.com',
    password: 'adeel321',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, jwtKey)
    }]
}

const tradeOne = {
    _id: new mongoose.Types.ObjectId(),
    type: 'buy',
    symbol: 'AB',
    shares: 12,
    price: 22,
    user_id: userOne._id
}

const tradeTwo = {
    _id: new mongoose.Types.ObjectId(),
    type: 'buy',
    symbol: 'AC',
    shares: 22,
    price: 12,
    user_id: userOne._id
}

const tradeThree = {
    _id: new mongoose.Types.ObjectId(),
    type: 'sell',
    symbol: 'AK',
    shares: 50,
    price: 23,
    user_id: userOne._id
}

const tradeFour = {
    _id: new mongoose.Types.ObjectId(),
    type: 'buy',
    symbol: 'AB',
    shares: 12,
    price: 22,
    user_id: userTwo._id
}

const tradeFive = {
    _id: new mongoose.Types.ObjectId(),
    type: 'sell',
    symbol: 'AK',
    shares: 50,
    price: 5,
    user_id: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Trade.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Trade(tradeOne).save()
    await new Trade(tradeTwo).save()
    await new Trade(tradeThree).save()
    await new Trade(tradeFour).save()
    await new Trade(tradeFive).save()

}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    tradeOne,
    setupDatabase
}