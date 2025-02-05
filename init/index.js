const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const { init } = require("../models/user.js");
const main = require("../connection.js")

//Mongo Connection
main('mongodb://127.0.0.1:27017/wanderlust-second')
.then((res) => {
    console.log('db connection was initailized')
})
.catch((e) => {
    console.log('db connection error -', e)
})

const initDB = async () => {

    try{
        await Listing.deleteMany({});
        initData.data = await initData.data.map((obj) => ({...obj, owner: '66edefc22d4dd98808582765'}));
        await Listing.insertMany(initData.data);
        console.log('data was initialized')
    }
    catch(err){
        console.log('err -', err)
    }
}

initDB();