var express = require('express');
var router = express.Router();
var geo = require('../controllers/GeoController');

module.exports = function(app) {

    router.get("/all", geo.all);
    router.get("/query", geo.query);

    app.use("/api/geo",router);    
}