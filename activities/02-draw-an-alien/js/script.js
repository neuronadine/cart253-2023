/************************************************
 * Draw an Alien
 * Nadine Mohamed
 *
 Draws an Alien Face
 ***********************************************/

// Setup
//
// Draws Alien Face
function setup() {
    createCanvas(640, 480);

    //
    background(255, 100, 100);
    noStroke();

    // Draw the body
    fill(127);
    ellipse(320, 480, 300, 200);

    // Draw the head
    fill(100);
    ellipse(320, 240, 250, 400);

    // Draw the eyes
    fill(0);
    ellipse(250, 240, 80, 250);
    ellipse(390, 240, 80, 250);

    // Draw the nostrils
    fill(0);
    ellipse(300, 350, 10, 10);
    ellipse(340, 350, 10, 10);

    // Draw the mouth
    stroke(200, 0, 0);
    strokeWeight(5);
    rectMode(CENTER);
    rect(320, 390, 100, 25);

}


/**
 * Description of draw()
*/
function draw() {

}