'use strict'

var express   = require('express');

var bodyparser  = require('body-parser');
var app  = express();

//CARGAR ARCHIVO DE RUTAS 
var RoutesUser  = require('./src/routes/Routesuser');


//MIDLEWARES
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//CORS
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API_KEY,Origin,X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow','GET,POST,OPTIONS,PUT,DELETE');
    next();
})



//RUTAS DEFINIDAS
app.use('/API',RoutesUser)

module.exports = app;

