var express = require('express');
var router = express.Router();
var doc = require('../controllers/DigitalOceanController');

module.exports = function(app) {

    router.post("/sbrow/restart", doc.restart_sbrow);

    app.use("/api/server",router);
}