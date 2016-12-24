var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var User = require('../models/User.js');

var crypto = require('crypto');

const secret = 'vn-app-secret';

router.post('/signin',function(req,res,next){

var pwd = crypto.createHmac('sha256', secret)
                        .update(req.body.password)
                        .digest('hex');

User.findOne({Email:req.body.email,Password:pwd}).exec(function(err,response){
    if(response!=null){
        
                res.json({success:true,id:response.id});
        }
        else{
            res.json({success:false,message:'Email or Password incorrect'});
        }
    });
});

router.post('/signup',function(req,res, next){


User.find({Email:req.body.email}).exec(function(err,response){
    if(response==null){
        console.log(req.body.password);
        var pwd = crypto.createHmac('sha256', secret)
                        .update(req.body.password)
                        .digest('hex');

            var user = new User({
                Email : req.body.email,
                Password : pwd
            });

            user.save(function(err,u){

                res.json({success:true,id:u.id});

            });
        }
        else{
            res.json({success:false,message:'Email already used'});
        }
    });
});

module.exports = router;