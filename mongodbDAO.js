//import the mongodb to access
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
//assigning the name of the db and collection
const dbName = 'headsOfStateDB'
const collName = 'headsOfState'

var headsOfStateDB
var headsOfState
//cconnect here
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((client)=>{
        headsOfStateDB =client.db(dbName)
        headsOfState = headsOfStateDB.collection(collName)

    })
    .catch((error)=>{
        console.log(error)
    })
//get all the heads of state stored in db
var getHead = function(){
    return new Promise((resolve, reject)=>{
        var cursor = headsOfState.find()
        cursor.toArray()
        .then((documents)=>{
            resolve(documents)
        })
        .catch((error)=>{
            reject(error)
        })
    })

}
//add a new head of state to mongo
var addHead = function(_id, headOfState){
    return new Promise((resolve, reject)=>{
        headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
        .then((result)=>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}
//export to use in index.js
module.exports = {getHead, addHead}