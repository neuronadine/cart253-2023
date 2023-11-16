/**
 * Soundscapes
 * Nadine Mohamed
 * 
 * This script creates an interactive canvas where moving dashed lines (notes) 
 * generate a dynamic visual pattern. Users can observe and interact with these 
 * notes, which respond to certain parameters and movements.
 */

"use strict";
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
    hitSound = loadSound('../assets/sounds/Piano Note B Sound Effect.mp3');
    reflectSound = loadSound('../assets/sounds/Piano Note C Sound Effect.mp3');
}


// Initialize the canvas and note object
function setup() {
    createCanvas(windowWidth, windowHeight);
    note = new Note(100, 0, 300, windowHeight, 90, 5, 20, 10);
    note.initialize();
    rectangle = new Transformer(90, 500, 50, 30, 45);

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
    note.move();
    note.checkCollisionAndReflect(rectangle);
    note.draw();
    rectangle.draw();

    // Manipulate playback rate based on mouse position
    let newRate = map(mouseX, 0, width, 0.5, 2);
    hitSound.rate(newRate);

}