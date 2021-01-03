var mysql = require('promise-mysql')

var pool
//link to database
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })
//get countreis in database
var getCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        //sql statement
        firstQuery = (co_code == undefined ? "select * from country" : "select * from country where co_code = ?;");
        var newQuery = {
            sql: firstQuery,
            values: [co_code]
        }
        pool.query(newQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//delete country specified by user when they click the delete button through this sql statement
var deleteCountry = function (co_code) {
   return new Promise((resolve, reject) => {
       var secondQuery ={
           sql: 'delete from country where co_code = ?',
           values: [co_code]
       }
       pool.query(secondQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
}
//add new user to the db
var add = function (co_code,co_name,co_details) { 
   return new Promise((resolve, reject) => {
        var thirdQuery = {
            sql: 'INSERT INTO country VALUES (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(thirdQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
}
var updateNation = function ( co_name,co_details, co_code) {
   return new Promise((resolve, reject) => {
     var myQuery = {
         sql: 'update country set co_name =?, co_details=? where co_code =?',
         values: [co_name, co_details, co_code]
     }
     pool.query(myQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
 }
 
//list all the cities in the db
var listCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city;')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
               reject(error)
            })
        })
}
//gget one city depending on the users choice
var oneCity = function (cty_code) {
    return new Promise((resolve, reject) => {
        var newQuery ={
            sql: 'select * from city where cty_code = ?',
            values: [cty_code]
        }
        pool.query(newQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//export to use in index.js
module.exports = { getCountry, deleteCountry, add, listCities, oneCity, updateNation}