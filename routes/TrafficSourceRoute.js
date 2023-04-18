var express = require('express');
var router = express.Router();
var trafficSource = require('../controllers/TrafficSourceController');

module.exports = function(app) {
    router.get('/balances', trafficSource.getBalances);
    router.post('/balances/update', trafficSource.updateBalance);
    app.use("/api/traffic-source", router);
}
