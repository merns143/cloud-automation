const speech = require('@google-cloud/speech');
const {Storage} = require('@google-cloud/storage');
var fs = require('fs');
var Client = require('ftp');

const GOOGLE_CLOUD_PROJECT_ID = 'abiding-casing-239106'; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = './speechToText.json'; // Replace with the path to the downloaded private key

const bucketStorage = new Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
});

const myBucket = bucketStorage.bucket('20190509storage');
const folderPath = './uploads/';
const bucketPath = 'Transcribe Archive/Flac Files';
const bucketTextPath = 'Transcribe Archive/Text Files';

const transcribe = async (filename) => {
    try {
            var flac = filename.split('.');
            var name = flac[0];

            await request(name, bucketPath);
    } catch (error) {
            console.log('FILE ERROR:', req.file.originalname);
            console.log(error);
    }
}

const request = async (filename, path) => {
    try {

        await upload(`${filename}.flac`, bucketPath);

        // Creates a client
        const client = new speech.SpeechClient({
            projectId: GOOGLE_CLOUD_PROJECT_ID,
            keyFilename: GOOGLE_CLOUD_KEYFILE,
        });

        const gcsUri = `gs://20190509storage/${path}/${filename}.flac`;
        const encoding = 'FLAC';
        const sampleRateHertz = 44100;
        const languageCode = 'en-GB';
        
        const config = {
            encoding: encoding,
            // sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
            enableAutomaticPunctuation: true
        };

        const audio = {
            uri: gcsUri,
        };

        const request = {
            config: config,
            audio: audio,
        };

        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        const [operation] = await client.longRunningRecognize(request);
        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();

        console.log('transcribing');

        const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

        const actualFileName = `${filename}.txt`;
        fs.writeFileSync(folderPath + actualFileName, transcription, function(err) {
            if(err) {
                return console.log(err);
            }
        
        });

        console.log(`${filename} Transcription: created`);

        // upload to ftp
        await uploadFtp(actualFileName);

        // delete files in local
        await fs.unlinkSync(`./uploads/${filename}.txt`);
        await fs.unlinkSync(`./uploads/${filename}.flac`);
    } catch (error) {
        console.log('FILE ERROR:', filename);
        console.log(error);
    }
};

const upload = (filename, path) => {
    return new Promise((resolve,reject)=>{
        const file = myBucket.file(`${path}/${filename}`);
        fs.createReadStream(folderPath+filename)
        .pipe(file.createWriteStream())
        .on('error', function(err) {
                reject(err);
            })
        .on('finish', function() {
                resolve(true);
                console.log(`${filename} uploaded to bucket`);
            });
    });
};

const uploadFtp = (filename) => {
    return new Promise((resolve, reject)=>{
        var c = new Client();
            c.on('ready', function() {
                var txtFile = fs.createReadStream(`./uploads/${filename}`);
                c.put(txtFile, `/Transcribe/${filename}`, function(err) {
                    if (err) { 
                        reject(err);
                    }else{
                        c.end();
                        resolve(true);
                        console.log(`${filename} uploaded to FTP`);
                    }
                });
            });

            // connect to ftp:21
            c.connect({host: '198.143.141.58', user: 'files@arctuslabs.com', password: '0KACJt6hFGORZ8vp'});
    });
};

module.exports = { transcribe }