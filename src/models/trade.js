const mongoose = require('mongoose')
const { Schema } = require("mongoose");

const tradeModel = 'Trades'

const tradeSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return value.toLowerCase() === 'buy' || value.toLowerCase() === 'sell'
            },
            message: props => `Type should be either buy or sell`
        }
    },
    symbol: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
    },
    shares: {
        type: Number,
        required: true,
        default: 1,
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 100
            },
            message: `Total number of traded shared should be between 1 and 100`
        }
    },
    price: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0
            },
            message: `Price should be a positive number`
        }
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: true
})
//Timestamps to add when they were created or updated.

const Trade = mongoose.model(tradeModel, tradeSchema)

module.exports = Trade