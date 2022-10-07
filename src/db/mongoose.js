const mongoose = require('mongoose')

const username = "adeel";
const password = "adeelmongodb";
const cluster = "cluster0.eutwwid";
const dbname = "stock-tra";

const localURL = 'mongodb://127.0.0.1:27017'

const mongoURL = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`

try {
    // Connect to the MongoDB cluster

    mongoose.connect(localURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error) => {
        if (!error) {
            console.log("Database connected");
        } else {

            console.log("Mongoose error: ", error);
        }

    });

} catch (e) {
    console.log("could not connect");
}
