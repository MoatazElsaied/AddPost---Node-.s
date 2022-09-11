const {MongoClient} = require("mongodb")
const dbURL = "mongodb://127.0.0.1:27017"
const myConnection = (cb) => {
    MongoClient.connect(dbURL, {}, (err, client)=>{
        if(err) return cb(err, false)
        const connection = client.db("g21HBS")
        cb(false, connection)
    })    
}


module.exports = myConnection