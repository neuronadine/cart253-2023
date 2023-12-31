/**
 * Simple Audio-Visual Interaction
 * Nadine Mohamed
 * 
 * This script creates an interactive canvas where moving circles interact with a static bar,
 * triggering dynamic sound effects and visual patterns.
 **/

"use strict";
let movingCircle;
let soundBar;
let hitSound;
let reflectSound;
let osc;
let synth;


// Preload sounds
function preload() {
    hitSound = loadSound('../assets/sounds/Piano Note B Sound Effect.mp3');
    reflectSound = loadSound('../assets/sounds/Piano Note C Sound Effect.mp3');
}


// Initialize the canvas and objects
function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize a simple visualization
    movingCircle = new MovingCircle(0, windowHeight / 2, 2, 20);
    soundBar = new SoundTriggerBar(windowHeight - 50, 30);

    // Initialize the oscillator
    osc = new p5.Oscillator();
    osc.setType('sine');
    osc.start();
    osc.amp(0);

    // Initialize the synthesizer
    synth = new p5.PolySynth();
}


// Update and display moving notes
function draw() {
    background(0);
    movingCircle.move();
    soundBar.draw();
    if (soundBar.collidesWith(movingCircle)) {
        soundBar.playSynthNote();
    }
    
    movingCircle.draw();
    let newRate = map(mouseX, 0, width, 0.5, 2);
    hitSound.rate(newRate);
}
