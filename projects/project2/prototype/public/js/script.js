/**
 * Soundscapes
 * Nadine Mohamed
 * 
 */

"use strict";
let currentPlayingSample = null;
let audioInitialized = false;
let isMusicPlaying = false;
let note;
let rectangle;
let hitSound;
let reflectSound;
let osc;
let synth;

/**
 * Description of preload
*/
function preload() {
    hitSound = loadSound('/assets/sounds/Piano Note B Sound Effect.mp3');
    reflectSound = loadSound('/assets/sounds/Piano Note C Sound Effect.mp3');
}

// Initialize the canvas and note object
function setup() {
    createCanvas(windowWidth, windowHeight);
    note = new Note(100, 0, 300, windowHeight, 90, 5, 20, 10);
    note.initialize();
    rectangle = new Transformer(90, 500, 50, 30, 45);
}

// Update and display moving notes
function draw() {
    // Skip the rest of the function if audio is not initialized
    if (!audioInitialized) return;

    background(0);
    note.move();
    note.checkCollisionAndReflect(rectangle);
    note.draw();
    rectangle.draw();

    // Manipulate playback rate based on mouse position
    let newRate = map(mouseX, 0, width, 0.5, 2);
    hitSound.rate(newRate);

}


function initializeCanvasAndMusic() {
    if (!audioInitialized) {
        userStartAudio().then(() => {
            audioInitialized = true;
            startMagentaMusic(); // Start generating music with Magenta
        });
    } else {
        startMagentaMusic(); // Audio already initialized, just start Magenta
    }
}






// Deprecated
// setupAudio() {
//     userStartAudio().then(() => {
//         osc = new p5.Oscillator('sine');
//         osc.amp(0);
//         osc.start();
    
//         synth = new p5.PolySynth();
    
//         audioInitialized = true;
    
//         // Optional: Start music generation immediately after audio setup
//         startMagentaMusic();
//       });

//     osc = new p5.Oscillator();
//     osc.setType('sine');
//     osc.start();
//     osc.amp(0);

//     synth = new p5.PolySynth();

//     // You might need to manually resume the audio context due to browser restrictions
//     if (getAudioContext().state !== 'running') {
//         getAudioContext().resume();
//     }

//     audioInitialized = true;
// }