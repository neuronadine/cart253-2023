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

/**
 * Description of preload
*/
function preload() {

}


// Initialize the canvas and note object
function setup() {
    createCanvas(windowWidth, windowHeight);
    note = new Note(50, 0, 300, windowHeight, 90, 5, 20, 10);
    note.initialize();
}


// Update and display moving notes
function draw() {
    background(255);
    note.draw();
    note.move();

}