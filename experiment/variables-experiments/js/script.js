/********************************************************
Variables
Nadine Mohamed
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 ********************************************************/

let bgShade = 0;
let circleX = 0;
let circleY = 250;
let circleSize = 200;
let circleSpeed = 2;
let circleAccelertion = 0.25;

/**
 * Description of preload
*/
function preload() {

}


/**
 * Description of setup
*/
function setup() {
    createCanvas(500, 500);
}


/**
 * Description of draw()
*/
function draw() {
    background(bgShade);
    // circleSize /=  1.01;
    circleX += circleSpeed;
    circleSpeed += circleAccelertion;
    ellipse(circleX, circleY, circleSize);
}