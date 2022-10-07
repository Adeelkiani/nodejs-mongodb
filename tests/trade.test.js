const request = require('supertest')
const app = require('../src/app')
const Trade = require('../src/models/trade')
const {
    userOne,
    tradeOne,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should add a trade of type buy', async () => {
    const response = await request(app)
        .post('/trades')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "symbol": "AB",
            "price": 12,
            "type": "buy",
            "shares": 1
        })
        .expect(201)

    const trade = await Trade.findById(response.body._id)
    expect(trade).not.toBeNull()
    expect(trade.type === 'buy').toEqual(true)
})

test('Should add a trade of type sell', async () => {
    const response = await request(app)
        .post('/trades')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "symbol": "AB",
            "price": 12,
            "type": "sell",
            "shares": 1
        })
        .expect(201)

    const trade = await Trade.findById(response.body._id)
    expect(trade).not.toBeNull()
    expect(trade.type === 'sell').toEqual(true)

})

test('Stock trade should return 400 for exceeding shares limit', async () => {
    const response = await request(app)
        .post('/trades')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "symbol": "AB",
            "price": 12,
            "type": "buy",
            "shares": 111
        }).expect(400)
})

test('Stock trade should return 400 for type mismatch', async () => {
    const response = await request(app)
        .post('/trades')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "symbol": "AB",
            "price": 12,
            "type": "xyz",
            "shares": 10
        }).expect(400)
})

test('Should fetch trades', async () => {
    const response = await request(app)
        .get(`/trades`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body).not.toBeNull()
})

test('Should fetch trades with optional parameter type', async () => {
    const response = await request(app)
        .get(`/trades`)
        .query({
            type: 'buy',
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

test('Should fetch trades with optional parameter user_id', async () => {
    const response = await request(app)
        .get(`/trades`)
        .query({
            user_id: `${userOne._id}`
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

test('Should fetch trades with all optional parameters', async () => {
    const response = await request(app)
        .get(`/trades`)
        .query({
            type: 'buy',
            user_id: `${userOne._id}`
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

test('Should not fetch trades with invalid optional parameters', async () => {
    const response = await request(app)
        .get(`/trades`)
        .query({
            type: 'xyz',
            user_id: `${userOne._id}`
        })
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(204)
})

test('Should get trade by id', async () => {
    const response = await request(app)
        .get(`/trades/${tradeOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const task = await Trade.findById(tradeOne._id)
    expect(task).not.toBeNull()
})

test('Should not get trade by invalid id', async () => {
    const response = await request(app)
        .get(`/trades/631841cc69d9c0f78e11cc11`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)
})
