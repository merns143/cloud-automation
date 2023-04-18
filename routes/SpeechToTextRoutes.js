var express = require('express');
var router = express.Router();
var controller = require('../controllers/SpeechToTextController');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Queue = require('better-queue');
var transcribeHelper = require('../helpers/transcribeHelper');
const https = require('https');
const axios = require("axios");

var q = new Queue(async (input, cb) => {
    try{
        await transcribeHelper.transcribe(input);
        cb();
    
    } catch (error) {
        console.log('FILE ERROR:', input);
        console.log(error);
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

module.exports = function(app){

    router.get("/speechtotext", controller.getSpeechToText);
    router.get("/download-speechtotext", controller.downloadTranscribe);
    router.post("/speechtotext", upload.single('file'), async function (req, res) {

        try {
            var flacfilename = req.file.originalname;

            q.push(flacfilename, async () => {
                    var message = `${flacfilename} transcribed successfuly!`;
                    try {
                        axios.get(`https://hooks.zapier.com/hooks/catch/2286988/vk00kj/?message=${message}`);
                    } catch (error) {
                        console.log('Alert error');
                    }
            });
    
            res.send({success: true, message: "Flac File Uploaded"});
      
        } catch (error) {
            res.status(500).json(error);
        }        

    });
    
    app.use("/api",router);
    
}