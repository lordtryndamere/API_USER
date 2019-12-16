'use strict'

var mongoose  = require('mongoose');
var app = require('./app');
var port   =  3701;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Users',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    app.listen(port,()=>{
        console.log("Servidor corriendo en el puerto  :  "+port);
        
    })
    console.log("CONEXION A LA BASE DE DATOS EXITOSA ");
    
});