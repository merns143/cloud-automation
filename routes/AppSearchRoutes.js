var express = require('express');
var router = express.Router();
var controller = require('../controllers/AppSearchController');

module.exports = function(app){

    router.get("/appsearch", controller.getAppSearch);
    router.get("/download-csvFile", controller.downloadCsvFile);
    router.get("/advance-download", controller.advanceDownload);
    router.get("/appsearch-queue", controller.appSearchQueue);
    router.post("/appsearch", controller.addAppSearch);
    router.post("/advancesearch", controller.advanceSearch);
    router.post("/devurlsearch", controller.devUrlSearch);
    router.post("/export-csv", controller.exportCsv);

    app.use("/api",router);
}