/**
 * Soundscapes
 * Nadine Mohamed
 * 
 */

"use strict";
let note;
let rectangle;
let hitSound;
let reflectSound;
let magenta;

//
function preload() {
    hitSound = loadSound('/assets/sounds/Piano Note B Sound Effect.mp3');
    reflectSound = loadSound('/assets/sounds/Piano Note C Sound Effect.mp3');
}

// Initialize the canvas and note object
function setup() {
    createCanvas(windowWidth, windowHeight);
    magenta = new Magenta();
    note = new Note(100, 0, 300, windowHeight, 90, 5, 20, 10, magenta);
    note.initialize();
    rectangle = new Transformer(90, 500, 50, 30, 45);
    // magenta.initializeAudio();
}

// Update and display moving notes
function draw() {
    if (!magenta.audioInitialized) return;
    background(0);
    note.move();
    note.checkCollisionAndReflect(rectangle);
    note.draw();
    rectangle.draw();
}


function initializeCanvasAndMusic() {
    if (!magenta.audioInitialized) {
        userStartAudio().then(() => {
            magenta.initializeAudio();
            magenta.startMagentaMusic();
        });
    } else {
        magenta.startMagentaMusic();
    }
}

function mousePressed() {
    rectangle.mousePressed(mouseX, mouseY);
}

function mouseDragged() {
    rectangle.mouseDragged(mouseX, mouseY);
}

function mouseReleased() {
    rectangle.mouseReleased();
}