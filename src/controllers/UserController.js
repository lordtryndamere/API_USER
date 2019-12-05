'use strict'
var User   = require('../models/Modeluser');
var fs = require('fs');
var path  = require('path')
var moment = require('moment')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


var userController  = {
    //METODO PRUEBA
    TEST(req,res){
    return res.status(200).send({
        message:"Funcionando el primer metodo"
    })
    },
    createuser(req,res){
        var user  = new User();
        var campos  = req.body;
        if(campos.nick && campos.name && campos.surname
            && campos.email && campos.password  )
        {
        user.name = campos.name;
        user.surname  = campos.surname;
        user.nick  = campos.nick;
        user.email = campos.email;
        user.role = campos.nick;
        user.password  = campos.password,
        user.file = null;
        user.status = false,
        user.create_at = moment().unix();
        user.updated_at = moment().unix();
        User.find({
            $or:[
                {email: user.email}, // se evitan repeticiones
                {nick : user.nick}
            ]
        }).exec((err,users)=>{
            if(users && users.length >=1){
                //encontro un usuario existente
                 return res.status(403).send({
                     message:" El usuario ya existe"
                 })
            }
            else{
                bcrypt.hash(campos.password,null,null,(err,hash)=>{

                    user.password = hash
                    if(err) return res.status(500).send({message:"No se pudo encriptar"})
                    user.save((err,userCreated)=>{
                        if(err) return res.status(500).send({message:"Error al crear usuario"});
                        
                        if(userCreated)
                        {
                            // userCreated.password = undefined
                            return res.status(200).send({User:userCreated});
                        }else{
                            return res.status(400).send({message:"No se pudo registrar el usuario"});
                        }
                    
                    })
                })

            }
        })

  
        }else{
            res.status(403).send({
                code:'403',
                message : "Por favor rellene todos los campos"
            })
        }

    },
    readOnly(req,res){
        var Userid  = req.params.id
        User.findById(Userid).exec((err,user)=>{
            if(err) return res.status(500).send({
                message:"No se pudo hacer la busqueda"
            })

            if(!user)  return res.status(404).send({
                message:"User not found"
            })

            return res.status(200).send({
                User:user
            })
        })

    },
    UpdateUser(req,res){
        var iduser  = req.params.id
        var campos  = req.body;
        User.findByIdAndUpdate(iduser,campos,{new:true},(err,userUpdate)=>{
            if (err)  return res.status(500).send({
                message:"No se pudo actualiza el usuario"
            });

            if(!userUpdate) return res.status(404).send({
                message: "el Usuario a actualziar no existe"
            })

            return res.status(200).send({
                code:"User Updated !!!",
                User:userUpdate
            })
        })

     
    },
    deleteuser(req,res){
        var userid  = req.params.id
        User.findByIdAndDelete(userid,(err,userdeleted)=>{
            if(err) return res.status(500).send({
                message:"No se pudo eliminar el usuario"
            })

            if(!userdeleted) return res.status(404).send({
                message:"No se encontro el usuario"
            })
            return res.status(200).send({
                code:"Usuario eliminado exitosamente !1",
                User:userdeleted
            })
        })


    },
    login(req,res){
        var params  = req.body;
        var email  = params.email;
        var password  = params.password;
        if(email&&password) {
        User.findOne({
            $or : [
                {email:email}
            ]
        })
        .exec((err,user)=>{
            if(err) return res.status(500).send({message:"Error al validar"});
         
            if(user){
                bcrypt.compare(password,user.password,(err,validation)=>{
                    if(err) return res.status(500).send({response:"No se pudo hacer la validacion"});

                    if(validation){
                        //FORMA DE VER INFO CON TOKEN O NORMAL
                        // if(params.token)
                        // {
                        //     res.status(200).send({
                        //         token : jwt.createToken(user)
                        //     })

                        // }else{
                        //      user.password = undefined
                        //      return res.status(200).send({
                        //          user
                        //      })
                        // }

                        // User.findOneAndUpdate(email,{status:true},{new:true},(err,updted)=>{
                        //     if(err) return res.status(500).send({message:"no se pudo actualizar"})
                        //     if(updted) return res.status(200).send({mess:"stt upd"})
                        // })

                        user.password = undefined
                        res.status(200).send({
                            token:jwt.createToken(user)
                        })
              

                    }else{
                        return res.status(404).send({error :"Las contraseña no son correctas"})
                    }

                })
            }else{
                return res.status(404).send({
                    message : "El usuario no existe !"
                })
            }
        
   
        })
    }else{
        return res.status(403).send({message:"Por favor rellene todos los campos"})
    }

   
    },
    listUsers(req,res){
        var page = 1
        var itemsperPage = 10
        if(req.params.page)
        {
            page = req.params.page
        }
        User.find().paginate(page,itemsperPage,(err,response)=>{
            if( err) return res.status(500).send({ message:"Error al recibir datos"})
            if(!response) return res.status(404).send({message:"No hay datos para mostrar"});
            return res.status(200).send({Users:Response})
        })

    },
    Uploadfile(req,res){
        var userid = req.params.id;
        var file_name = "File not uploaded";
        if(req.files)
        {
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var file_name = fileSplit[1];
            var exSplit = file_name.split('\.');
            var fileExt = exSplit[1];

            // if(fileExt=='png' || fileExt == 'zip' || fileExt=='jpeg' ||fileExt== 'gif' || fileExt == 'jpg' ){
                
                User.findByIdAndUpdate(userid,{file:file_name},{new:true},(err,userupdated)=>{

                    if (err) return res.status(500).send({
                        message:" el Archivo no se ha subido"
                    });
                    
                    if (!userupdated) res.status(404).send({
                        message:"el User no existe"
                    });
    
                    return res.status(200).send({
                        user:userupdated
                    });
    
                }) 

            // }
            // else{
            //     fs.unlink(filePath,(err)=>{
            //         return res.status(200).send({
            //             message:"La extension no es valida"
            //         })
            //     })

            // }
        }
        else{
            return res.status(200).send({
                message:file_name
            })
        }
    },
    getFile(req,res){   
        var file = req.params.image
        var path_file  = './uploads/'+file; 
        fs.exists(path_file,(exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }
            else{
                return res.status(404).send({
                    status:'error',
                    message: "El archivo no exite"
                });
            }
        })
    }


}


module.exports = userController;