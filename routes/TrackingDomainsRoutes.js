var express = require('express');
var router = express.Router();
var sb = require('../controllers/TrackingDomainsController');

module.exports = function(app){

    router.get("/tracking-credentials", sb.get_credentials);
    router.post("/tracking-credentials", sb.add_credential);
    router.delete("/tracking-credentials/:id", sb.delete_credential);

    router.get("/tracking-domains", sb.get_tracking_domains);
    router.post("/tracking-domains", sb.add_tracking_domains);
    
    app.use("/api",router);
    
}