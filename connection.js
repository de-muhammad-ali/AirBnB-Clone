const mongoose = require('mongoose');

//Connection
async function main(MONGO_URL) {
    await mongoose.connect(MONGO_URL)
}

module.exports = main;