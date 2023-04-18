var config = require('../config');
var fs = require('fs');
var axios = require('axios').default;
var baseUrl = config.speechtotext;

var express = require('express');
var multer = require('multer');
var app = express();
var request = require('request');
var Client = require('ftp');

module.exports = {

    getSpeechToText: function(req, res) {
        var c = new Client();
                c.on('ready', function() {
                    c.list('/Transcribe', function(err, list) {
                        if (err) throw err;
                        // console.dir(list);
                        res.status(200).json({list});
                        c.end();
                });
            });

            // connect to localhost:21 as anonymous
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
     },

     downloadTranscribe: function(req, res){
        var filename = req.query.filename;
        var c = new Client();
            c.on('ready', function() {
                c.get(`/Transcribe/${filename}`, function(err, stream) {
                    if (err) {console.log(err);
                    }else{
                        stream.once('close', function() { 
                            res.download(`./download/${filename}`, filename, function(err){
                                if (err) {console.log('---------- error downloading file: ' + err);
                                }else{
                                    fs.unlinkSync(`./download/${filename}`);
                                    c.end();
                                };
                            }); 
                        });
                        stream.pipe(fs.createWriteStream(`./download/${filename}`));
                    }
                });
            });

            // connect to localhost:21 as anonymous
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
    }

}
