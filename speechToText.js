const speech = require('@google-cloud/speech');
const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const storage = new Storage();
const myBucket = storage.bucket('20190509storage');
const folderPath = 'C:\\Users\\Admin\\ng-projects\\nexys-media\\speechtotextbackup\\1 - Foundation\\basics 3\\';

const request = async (filename, path) => {
    try {
        // Creates a client
        const client = new speech.SpeechClient();

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

        const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

        const actualFileName = `${filename}.text`;
        fs.writeFileSync(folderPath + actualFileName, transcription, function(err) {
            if(err) {
                return console.log(err);
            }
        
        }); 

        console.log(`${filename} Transcription: created`);

        await upload(actualFileName, path);
    } catch (error) {
        console.log('FILE ERROR:', filename);
        console.log(error);
    }
};

const upload = (filename, path) => {
    return new Promise((resolve,reject)=>{
        const file = myBucket.file(`${path}/Transcribes/${filename}`);
        fs.createReadStream(folderPath+filename)
        .pipe(file.createWriteStream())
        .on('error', function(err) {
            reject(err);
        })
        .on('finish', function() {
            console.log(`${filename} Transcription: uploaded`);
            resolve(true);
        });
    });
}

(async () => {
    const path = '1 - Foundation/Basics 3';
    const files = [
        'Headspace - Basics 3 Day 1',
        'Headspace - Basics 3 Day 2',
        'Headspace - Basics 3 Day 3',
        'Headspace - Basics 3 Day 4',
        'Headspace - Basics 3 Day 5',
        'Headspace - Basics 3 Day 6',
        'Headspace - Basics 3 Day 7',
        'Headspace - Basics 3 Day 8',
        'Headspace - Basics 3 Day 9',
        'Headspace - Basics 3 Day 10'
    ];
    let promises = [];

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        promises.push(request(filename, path));
    }

    await Promise.all(promises);
})();