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
    speed : 1,
    fill : 255
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
    circle.x += circle.speed;

    circle.x = constrain(circle.x, 0, width);
   
    circle.size = map(mouseY, 0, height, 50, 500);
    circle.fill = map(mouseX, 0, width, 0, 255);
    fill(circle.fill);
    ellipse(circle.x, circle.y, circle.size);

    // console.log(`circle.x : ${circle.x}, circle.y : ${circle.y}`)
    // console.log(randomNumber);
}