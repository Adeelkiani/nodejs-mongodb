const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, userOneId, setupDatabase } = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Adeel',
        email: 'adeel@gmail.com',
        password: 'adeel123'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assert about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Adeel',
            email: 'adeel@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('adeel123')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)


    const user = await User.findById(userOneId)
    // Assert about the response
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "userOne.password"
    }).expect(400)

})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Adeel kiani'
        })
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Adeel kiani')
})


test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Islamabad'
        })
        .expect(400)
})