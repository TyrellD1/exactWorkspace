const mongoose = require('mongoose');

const mongooseConnect = () => { mongoose.connect('mongodb://localhost:27017/exactApp', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("ERROR!")
        console.log(err)
    });
}

module.exports = mongooseConnect;