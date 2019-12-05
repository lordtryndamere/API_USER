'use strict'

var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;


var ModelUser  = Schema({
    name:String,
    surname:String,
    nick:String,
    email:String,
    role:String,
    password:String,
    file:String,
    status:Boolean,
    create_at:String,
    updated_at:String
})


module.exports = mongoose.model('Users',ModelUser);