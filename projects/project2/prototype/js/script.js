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
let startX = 50;
let startY = 0;
let endX = 0;
let angle = 0;
let stroke = 5;
let dashLength = 20;
let space = 10;

/**
 * Description of preload
*/
function preload() {

}


// Initialize the canvas and note object
function setup() {
    createCanvas(windowWidth, windowHeight);
    note = new Note(startX, startY, endX, windowHeight, angle, stroke, space);
    note.initialize();
}


// Update and display moving notes
function draw() {
    background(255);
    note.draw();
    note.move();

}