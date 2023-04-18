var express = require('express');
var router = express.Router();
var controller = require('../controllers/KeywordWatcherController');


module.exports = function(app){

    router.get("/keywordwatcher", controller.getKeyword);
    router.post("/keywordwatcher", controller.addKeyword);
    router.delete("/keywordwatcher/:keyword", controller.deleteKeyword);

    app.use("/api",router);
}