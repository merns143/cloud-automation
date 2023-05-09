var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var User = require("../models/User");

const getUser = (user) => {
    return new Promise((resolve,reject)=>{
        User.find({
            username: user.username,
            password: user.password
         }, (error, data) => {
             if (error) reject(error);
             resolve(data[0]);
         });
    });
};

module.exports = function(app){

    router.post('/auth', async (req, res) => {       

        try {
            if (!req.body.username || !req.body.password) {
                throw new Error('Invalid username or password');
            }

            const user = await getUser(req.body);

            if (!user) {
                throw new Error('Invalid username or password');
            }

            const payload = {
                user:  user.username,
                role: user.role
            };

            const token = jwt.sign(payload, app.get('superSecret'), {
                expiresIn: '5h'
            });
    
            // return the information including token as JSON
            res.json({
                success: true,
                token: token
            });


        } catch (error) {
            res.json({ success: false, message:  error.message});
        }
    });

    router.post('/auth/verify', function(req, res) {       

        if (!req.body.token) {
            res.json({ success: false, message: 'Invalid request' });
        } else {
            jwt.verify(req.body.token, app.get('superSecret'), function(err, response) {
                res.json({
                    success: true,
                    data: (response && response.user) ? response : {} 
                });
            });
        }
    
    });

    router.get("/domain-file-check/default-file", function(req, res){
        res.download("./default-domain-check.csv");
    });

    router.get("/domain-file-check/download-result", function(req, res){
        res.download("./result.csv");
    });

    router.get("/heroku-cicd-test", function(req, res){
        res.json({ test: 'test'});
    });
        
    app.use("/api",router);
    
}