/********************************************************
Variables
Nadine Mohamed
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 ********************************************************/

let bgShade = 0;
let circle = {
    x : 0,
    y : 250,
    size : 200,
    speed : 2
};

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
    circle.x += circle.speed;
    // circle.speed += circleAccelertion;
    ellipse(circle.x, circle.y, circle.size);

    console.log(`circle.x : ${circle.x}, circle.y : ${circle.y}`)
    // console.log("circle.x: " + circle.x);
    // console.log("circle.y: " + circle.y);
}