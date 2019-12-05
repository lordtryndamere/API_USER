'use strict'

var express  = require('express');
var validaor  = require('../middlewares/authenticated')
var UserController  = require('../controllers/UserController');
var route = express.Router();

//MIDLEWARE
//MIDLEWARE

var multipart = require('connect-multiparty');
var multipartmiddleware = multipart({uploadDir:'./uploads'});


//DEFINO RUTAS

route.post('/create',UserController.createuser);
route.get('/readuser/:id',UserController.readOnly);
route.put('/updateuser/:id',validaor.auth,UserController.UpdateUser);
route.delete('/deleteuser/:id',validaor.auth,UserController.deleteuser);
route.post('/login',UserController.login);
route.get('/list/:page?',UserController.listUsers);
route.post('/upload/:id',multipartmiddleware,UserController.Uploadfile);
route.get('/getimage/:image', validaor.auth, UserController.getFile);


module.exports = route; 
