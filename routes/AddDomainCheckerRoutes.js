var express = require('express');
var router = express.Router();
var controller = require('../controllers/AddDomainCheckerController');

module.exports = function(app){

    router.post("/add-domain-checker", controller.domainchecker);

    app.use("/api",router);

}