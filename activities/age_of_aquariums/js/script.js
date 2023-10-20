/**
 * Title of Project
 * Author Name
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";

/**
 * Description of preload
*/
function preload() {

}


/**
 * Description of setup
*/
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}


/**
 * Description of draw()
*/
function draw() {

    // Draw the balance
    push();
    translate(width / 2, height / 1.66);
    rect(-500 / 2, -10 / 2, 500, 10);
    triangle(-30, 40, 30, 40, 0, 0); 
    pop();

    // Water tanks
    rect(120, (height / 2) - 28, 80, 100);
    rect(width - 200, (height / 2) - 28, 80, 100);
}