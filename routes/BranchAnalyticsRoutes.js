var express = require('express');
var router = express.Router();
var controller = require('../controllers/BranchAnalyticsController');
var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, 'branch-data-import.csv')
    }
});

var upload = multer({ storage: storage });


module.exports = function(app){

    router.get("/branchanalytics", controller.getBranchData);

    router.post("/branchanalytics", upload.single('file'), async function (req, res) {

        try {
            res.send({success: true, message: "CSV File Uploaded Successfuly"});
        } catch (error) {
            res.status(500).json(error);
        }

    });


    app.use("/api",router);
}