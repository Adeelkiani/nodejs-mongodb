const mongoose = require('mongoose')
const _validator = require('validator')
const { Schema } = require("mongoose");
const bcrypt = require('bcryptjs')
const jwtToken = require('jsonwebtoken')

const userModel = 'Users'
const jwtKey = 'thisismynewpassword'

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (value) {
                return _validator.default.isEmail(value)
            },
            message: props => `${props.value} is invalid email`
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate: {
            validator: function (value) {
                return !value.toLowerCase().includes('password')
            },
            message: "Password shouldn't contain 'password'"
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true
})
//Timestamps to add when they were created or updated.

// Virtual property to create a relationship
userSchema.virtual('trades', {
    ref: 'Trades',
    localField: '_id',
    foreignField: 'user_id'
})

//'methods' are accessed on instances

// Hiding confidential information
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwtToken.sign({ _id: user._id.toString() }, jwtKey)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// Finding user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Invalid credentials')
    }

    return user
}

// Hashing plain text password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model(userModel, userSchema)

module.exports = User