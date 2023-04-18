var express = require('express');
var router = express.Router();
var sb = require('../controllers/SafebrowsingController');
var multer  = require('multer');
var path       = require('path');
var fs       = require('fs');
var csv = require("fast-csv");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.csv')
    }
});
var upload = multer({ storage: storage });

var deleteFile = function(file) {
    fs.unlink(`./${file}`, (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
    });
};

module.exports = function(app){

    router.get("/credentials", sb.get_credentials);
    router.post("/credentials", sb.add_credential);
    router.delete("/credentials/:id", sb.delete_credential);

    router.get("/voluum-credentials", sb.get_voluum_credentials);
    router.put("/voluum-credentials/:id", sb.update_voluum_credentials);

    router.get("/available-urls", sb.get_avaiable_urls);
    router.post("/available-urls", sb.add_avaiable_urls);   

    // Domains api endpoints
    router.get("/domains", sb.get_domains);
    router.post("/domains", sb.add_domains);

    router.post("/domain-file-check", upload.single('file'), function (req, res) {
        
        var fileInfo = path.parse(req.file.filename);
        var domains = [];
        csv
        .fromPath(`./${fileInfo.base}`)
        .on("data", function(data){
            domains.push(data[0]);
        })
        .on("end", function(){
            
            if (domains.length > 0) {
                sb.handle_domains_checking(domains, res);
            } else {
                res.status(200).json({success: true, domains:[]});
            }
           
        })
        .on("error", function(){
            res.status(500).json({success: false});
        });       

        deleteFile(fileInfo.base);
               
    });



    app.use("/api",router);
    
}