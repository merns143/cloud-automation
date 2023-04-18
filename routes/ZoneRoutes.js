var express = require('express');
var router = express.Router();
var zone = require('../controllers/ZoneController');

module.exports = function(app){

    router.get("/:filter", zone.get_list);
    router.post("/", zone.add); // required: name
    router.get("/:id", zone.details);
    
    router.get("/:id/dns_records", zone.get_dns_list);
    router.post("/:id/dns_records", zone.add_dns); // required: type (A, CNAME), name, content (zone name)
    
    router.post("/check", zone.checker);
    router.post("/check-analytics", zone.check_analytics);

    router.post("/check-ssl", zone.check_ssl);
    router.post("/disable-ssl", zone.disable_ssl);

    router.get("/download/domains", zone.download_domains);

    app.use("/api/zones",router);
    
}