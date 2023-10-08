/********************************************************
Variables
Nadine Mohamed
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 ********************************************************/

let bgShade = 0;
let circle = {
    x : 250,
    y : 250,
    size : 200,
    speed : 1,
    fill : 0
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

    circle.speed = random(-5, 5);
    circle.x += circle.speed;
    circle.size = random(0, 200);

    circle.fill = random(0, 255);
    fill(circle.fill);
    ellipse(circle.x, circle.y, circle.size);

    // console.log(`circle.x : ${circle.x}, circle.y : ${circle.y}`)

    let randomNumber = random();
    // console.log(randomNumber);
}