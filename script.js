const util = require('util');
var fs = require('fs');
const exec = util.promisify(require('child_process').exec);

const ephemeralFile = './tmp';
const transitionsFile = './transitions'
const framesFile = `${ephemeralFile}/frames`;
const inputImg = `${ephemeralFile}/hfclub.jpeg`;
const possibleTransitions = fs.readdirSync(transitionsFile);
const goofyOutput = 'out.mp4';

const step1 = `rm -rf ${framesFile}`;

let step2Size = 10;
let step2Piece = '';
while (step2Size > 0) {
    const randIndex = Math.floor(Math.random() * possibleTransitions.length);
    const transitionInput = `${transitionsFile}/${possibleTransitions[randIndex]}`;
    possibleTransitions.splice(randIndex, 1);

    step2Piece = step2Piece + ` -t ${transitionInput} -i ${inputImg}`;
    step2Size = step2Size - 1;
}

const step2 = `gl-transition-render -g ./tmp/spiral.png -d 15 -i ${inputImg} ${step2Piece} -f 30 -w 1280 -h 894 -o ${framesFile}`;
const step3 = `ffmpeg -y -framerate 30 -i ${framesFile}/%d.png -r 30 ${framesFile}/video.mp4`;
const step4 = `ffmpeg -y -i ${framesFile}/video.mp4 -c:v h264 -c:a aac -b:v 196k -b:a 196k -preset fast -crf 22 -ar 44100 -pix_fmt yuv420p -video_track_timescale 90000 -r 30 ${goofyOutput} `;

async function makeItGoofy() {

    try {
        console.log(step2);

        await exec(step1);
        console.log(`- step 1: ok`);

        const {stdout, stderr} = await exec(step2);
        console.log(`- step 2: ok`);
        console.log('stdout', stdout);
        console.log('stderr', stderr);

        await exec(step3);
        console.log(`- step 3: ok`);

        await exec(step4);
        console.log(`- step 4: ok`);        
    } catch (err) {

        console.warn(err);
    };        
};

makeItGoofy();