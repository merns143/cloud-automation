var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');

module.exports = function(app){

    // route middleware to verify a token
    router.use(function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.headers['x-access-token'] || req.query.accessToken;

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
                if (err) {
                    return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });    
                } else {
                    const path = req.path;

                    if (path.indexOf('hrlogs') !== -1 && decoded.role !== 'masteradmin') {
                        return res.status(401).json({ success: false, message: 'Unauthorized access' });    
                    }

                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;    
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });

        }
    });
        
    app.use(router);
    
}