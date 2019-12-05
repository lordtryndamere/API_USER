'use strict'

var jwt  = require('jwt-simple');
var moment = require('moment');
var secreet = "mi_llave";


exports.auth = (req,res,next) =>{
if(!req.headers.autorization){
    return res.status(403).send({message:"NO TIENE PERMISOS DE ACCESO"})
}

var token  = req.headers.autorization.replace(/['"]+/g,'');

//DECODE TOKEN
try {
    var payload  = jwt.decode(token,secreet);

    
    if (payload.exp <= moment.unix()) {
        return res.status(401).send({message:"El token ha expirado"})
    }
    else{
        next();
    }
} catch (error) {
    return res.status(403).send({code:  '403', message:"el token no es valido -->"+error})
}

req.user = payload;
}