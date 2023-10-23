const util = require('util');
var fs = require('fs');
const exec = util.promisify(require('child_process').exec);

const ephemeralFile = './tmp';
const transitionsFile = './transitions'
const framesFile = `${ephemeralFile}/frames`;
const inputImg = `${ephemeralFile}/image.png`;
const possibleTransitions = fs.readdirSync(transitionsFile);
const goofyOutput = 'out.mp4';

const step1 = `rm -rf ${framesFile}`;

let step2Size = 7;
let step2Piece = '';
while (step2Size > 0) {
    const randIndex = Math.floor(Math.random() * possibleTransitions.length);
    const transitionInput = `${transitionsFile}/${possibleTransitions[randIndex]}`;

    step2Piece = step2Piece + ` -t ${transitionInput} -i ${inputImg}`;
    step2Size = step2Size - 1;
}

const step2 = `gl-transition-render -g ./tmp/spiral.png -d 15 -i ${inputImg} ${step2Piece} -f 30 -w 632 -h 632 -o ${framesFile}`;
const step3 = `ffmpeg -y -framerate 30 -i ${framesFile}/%d.png -r 30 ${goofyOutput}`;

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
    } catch (err) {

        console.warn(err);
    };        
};

makeItGoofy();