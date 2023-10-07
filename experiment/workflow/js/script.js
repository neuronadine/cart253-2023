/**************************************************
 Drawing Experiments
 Nadine Mohamed
 
 Experimenting with p5's drawing and color functions.
 Currently draws a face on the canvas
 ***********************************************/

"use strict";

/**
 * Description of preload
*/
function preload() {

}


// setup()
// 
// Draws a face on the canvas
function setup() {
    createCanvas(500, 500);

    // set the background to mint
    background(191, 255, 199);

    // Draw a flesh-coloured head
    fill(250, 200, 200);
    ellipse(250, 250, 200, 200);

    // Draw eyes
    fill(0);
    ellipse(200, 250, 30, 30);
    ellipse(300, 250, 30, 30);

    // Draw mouth
    strokeWeight(10);
    line(200, 300, 300, 300);
}


/**
 * Description of draw()
*/
function draw() {

}