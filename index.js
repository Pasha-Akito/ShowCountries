//importing modules etc
var express = require('express')
var ejs = require('ejs')
var bodyParser = require('body-parser')
const app = express()
var mysql = require('promise-mysql')
var mysqlDAO = require('./mySQLDAO')
var mongodbDAO = require('./mongodbDAO')
//create a link between you the user and the database that can be found below
var pool

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


//body parser in order to use the application and its functionality
app.use(bodyParser.urlencoded({ extended: false }))

//use ejs as a view engine
app.set('view engine', 'ejs')
//main page that the user is greeted with
app.get('/', (req, res) => {
    res.render("main")
})
//get method, we use this to get the countries from the database
app.get('/listcountries', (req, res) => {
    mysqlDAO.getCountry()
        .then((result) => {
            console.log(result)
            res.render('listcountries', { country: result })
        })
        //send an error should it fail
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})
//get method where the user clicks the button and the country can be deleted
app.get('/listcountries/:co_code', (req, res) => {
    mysqlDAO.deleteCountry(req.params.co_code)
        .then((result) => {
            res.redirect('/listcountries')
        })
        .catch((error) => {
            res.send('<h3>Delete not possible please return to list countries page</h3')
        })
})
//rendering the page where a user can add to the database
app.get('/add', (req, res) => {
    res.render("add")
})
//post the add method, added to the databse
app.post("/add", (req, res) => {
    mysqlDAO.add(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((data) => {
            res.redirect('/listcountries')
            console.log(data)
        })
        //error shown should this fail
        .catch((error) => {
            res.send('<h3>Cannot add a country that already exists </h3')
        })
})
//edit a  country. co_code signifies which country is to be edited
app.get('/edit/:co_code', (req, res) => {
    //get the country code
    mysqlDAO.getCountry(req.params.co_code)
        .then((result) => {
            console.log(result)
            //render the edit page of the country
            res.render("edit", { country: result[0] })
        })
        //error should this fail
        .catch((error) => {
            res.send(error)
        })
})
//post method of editing a country. 
app.post("/edit", (req, res) => {
    //updateNation is where the sql statement is carried out
    mysqlDAO.updateNation(req.body.co_name, req.body.co_details, req.body.co_code)
        .then((data) => {
            //rediric the user
            res.redirect('/listcountries')
        })
        .catch((error) => {
            console.log(error)
        })
})


//get one cities details based on the code
app.get('/listcities/:cty_code', (req, res) => {
    mysqlDAO.oneCity(req.params.cty_code)
        .then((result) => {
            res.render('city', { city: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//get method to get all the cities details and display it on page in a table
app.get('/listcities', (req, res) => {
    mysqlDAO.listCities()
        .then((result) => {
            res.render('listcities', { city: result })
        })
        .catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})
//get the HeadsOfState data and display on the html page
app.get('/listheadofstate', (req, res) => {
    mongodbDAO.getHead()
        .then((documents) => {
            //render the page
            res.render('headofstate', { headofstate: documents })
        })
        .catch((error) => {
            res.send(error)
        })
})
//get addHead page, user can add new record
app.get('/addHead', (req, res) => {
    res.render("addHead")
})

//send the result to the database and display in html
app.post('/addHead', (req, res)=>{
    //added data passed to parameters
    mongodbDAO.addHead(req.body._id, req.body.headOfState)
    .then((result)=>{
        //redirect the user
        res.redirect('/listheadofstate')
    }).catch((error)=>{
        res.send('<h3>Error Cannot Connect to database! </h3')
    })
})

//listen to the port 3000 in order to access the app
app.listen(3000, () => {
    console.log("Listening for port 3000")
})

