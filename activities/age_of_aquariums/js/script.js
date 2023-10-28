/**
 * Exchange Rate
 * Nadine Mohamed
 * 
 * 
 */

"use strict";

let angle = 0;
let leftWaterLevel = 0;
let rightWaterLevel = 0;
let buttonRX, buttonLX, buttonY;

// Size and position settings for the various elements
const balanceLength = 500;
const balanceHeight = 10;
const tankWidth = 80;
const tankHeight = 100;
const buttonWidth = 50;
const buttonHeight = 25;
const edge = 40;
const leftWeightFactor = 1.5;

let water = [];


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

    // for () {
        
    // }


}


/**
 * Description of draw()
*/
function draw() {
    background(0);

    // Update the angle based on water levels
    let effectiveLeftWaterLevel;
    if (leftWaterLevel === 0 && rightWaterLevel === 0) {
        effectiveLeftWaterLevel = leftWaterLevel;
        angle = map(effectiveLeftWaterLevel - rightWaterLevel, -100, 100, -PI / 4, PI / 4);
        
    } else {
        effectiveLeftWaterLevel = leftWaterLevel * leftWeightFactor;
        angle = map(effectiveLeftWaterLevel - rightWaterLevel, -100 * leftWeightFactor, 100, -PI / 4, PI / 4);
    }

    // New drawing
    push();
    translate(width / 2, height / 1.66);
    rotate(angle);

    // Draw ballance beam
    rect(-balanceLength / 2, -balanceHeight / 2, balanceLength, balanceHeight);
    
    // Draw the fulcrum
    fill(0, 118, 59);
    translate(0, 5);
    triangle(-30, 40, 30, 40, 0, 0); 

    let leftTankX = -balanceLength / 2 - tankWidth / 2 + tankWidth / 4 + edge;
    let rightTankX = balanceLength / 2 - tankWidth / 2 - tankWidth / 4 - edge;
    
    // Water tanks
    let tanksY = -(balanceHeight + tankHeight)
    fill(255);
    rect(leftTankX, tanksY, tankWidth, tankHeight);
    rect(rightTankX, tanksY, tankWidth, tankHeight);

    // Represent water in the tanks
    const waterHeightLeft = map(leftWaterLevel, 0, 100, 0, tankHeight);
    const waterHeightRight = map(rightWaterLevel, 0, 100, 0, tankHeight);

    fill(255, 0, 0);
    noStroke();
    for (let i = 0; i < tankWidth; i++) {
        let tilt = tan(angle) * i;
        let topLY = min(-waterHeightLeft + tilt, 0);
        let topRY = min(-waterHeightRight + tilt, 0);

        rect(leftTankX + i, -balanceHeight, 1, topLY);
        rect(rightTankX + i, -balanceHeight, 1, topRY);
    }

    pop();


    // Draw buttons
    buttonRX = 130;
    buttonLX = width - 180;
    buttonY = height / 2 + tankHeight + 10;

    fill(100);
    rect(buttonRX, buttonY, buttonWidth, buttonHeight);
    rect(buttonLX, buttonY, buttonWidth, buttonHeight);

    // Text in buttons
    fill(255);
    textAlign(CENTER, CENTER);

    let textLX = 130 + buttonWidth / 2;
    let textRX = width - 180 + buttonWidth / 2;
    let textY = height / 2 + tankHeight + 10 + buttonHeight / 2;

    text("Fill", textLX, textY);
    text("Fill", textRX, textY);
}

function mousePressed() {
    const inButtonL =
        mouseX > buttonRX && mouseX < buttonRX + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight;

    const inButtonR =
        mouseX > buttonLX && mouseX < buttonLX + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight

    if (inButtonL) {
        leftWaterLevel = min(leftWaterLevel + 2, 100);
    } else if (inButtonR) {
        rightWaterLevel = min(rightWaterLevel + 2, 100);
    }
}

