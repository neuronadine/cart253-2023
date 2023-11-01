/**
 * Bleach
 * Author : Nadine Mohamed
 * Date : 26/10/2023
 * 
 * In this program, the user's objective is to keep two water tanks balanced. 
 * The tanks can be filled with water, each having a different weight factor 
 * that affects the overall balance. If the water level of either tank exceeds 
 * its capacity, the game ends. 
 */

"use strict";

// Initialize global variables
let angle = 0;
let leftWaterLevel = 0;
let rightWaterLevel = 0;
let buttonRX, buttonLX, buttonY;
let leftWeightFactor = 1.5;
let rightWeightFactor = 1.5;
let gameOver = false;

// Initialize constant variables
const balanceLength = 500;
const balanceHeight = 10;
const tankWidth = 80;
const tankHeight = 100;
const buttonWidth = 50;
const buttonHeight = 25;
const edge = 40;
const balanceThreshold = 3;
const angleThreshold = 0.01;

let water = [];
let leftWeights = [];
let rightWeights = [];


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
}


/**
 * Description of draw()
*/
function draw() {

    background(0);

    // Set text properties
    textSize(38);  // Set font size
    fill(255);  // White text
    textAlign(CENTER, CENTER);  // Centered text

    // Draw the title
    text("Bleach", width / 2, 50);

    // Turn screen red if GameOver
    if (gameOver) {
        background(255, 0, 0);
        fill(255);
        rect(width / 2 - 75, height / 2 - 15, 150, 30);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(20); 
        text("Restart", width / 2, height / 2);
        return;
    }

    // Update the angle based on water levels
    let effectiveLeftWaterLevel;
    let effectiveRightWaterLevel;
    if (leftWaterLevel === 0 && rightWaterLevel === 0) {
        effectiveLeftWaterLevel = leftWaterLevel;
        angle = map(effectiveLeftWaterLevel - rightWaterLevel, -100, 100, -PI / 4, PI / 4);
        
    } else {
        effectiveLeftWaterLevel = leftWaterLevel * leftWeightFactor;
        effectiveRightWaterLevel = rightWaterLevel * rightWeightFactor;
        angle = map(effectiveLeftWaterLevel - effectiveRightWaterLevel, -100 * leftWeightFactor, 100 * rightWeightFactor, PI / 4, -PI / 4);
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


    let waterHeightsL = [];
    let waterHeightsR = [];

    for (let i = 0; i < tankWidth; i++) {

        if ( abs(leftWaterLevel - rightWaterLevel) <= balanceThreshold && abs(angle) <= angleThreshold) {
            fill(0, 255, 0);
            noStroke();
        }

        if (leftWaterLevel === rightWaterLevel) {
            fill(255, 0, 0);
            noStroke();
        }

        let tilt = tan(angle) * (tankWidth - i);
        let topLY = min(-waterHeightLeft + tilt, 0);
        let topRY = min(-waterHeightRight + tilt, 0);
        waterHeightsL.push(topLY);
        waterHeightsR.push(topRY);

        fill(0, 53, 185);
        noStroke();
        rect(leftTankX + i, -balanceHeight, 1, topLY);

        fill(255, 0, 0);
        noStroke();
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
    textSize(12);
    textAlign(CENTER, CENTER);

    let textLX = 130 + buttonWidth / 2;
    let textRX = width - 180 + buttonWidth / 2;
    let textY = height / 2 + tankHeight + 10 + buttonHeight / 2;

    text("Fill", textLX, textY);
    text("Fill", textRX, textY);

    let maxWaterHeightL = Math.max(...waterHeightsL);
    let maxWaterHeightR = Math.max(...waterHeightsR);
    let topLeftY = tanksY + tan(angle) * tankWidth;
    let topRightY = tanksY - tan(angle) * tankWidth;

    if (maxWaterHeightL - balanceHeight <= topLeftY || maxWaterHeightR - balanceHeight <= topRightY) {
        gameOver = true;
        return;
    }
}

function mousePressed() {

    if (gameOver) {
        // Check if mouse is within the "Restart" button bounds
        if (mouseX > (width / 2 - 75) && mouseX < (width / 2 + 75) &&
            mouseY > (height / 2 - 15) && mouseY < (height / 2 + 15)) {
            // Reset the game variables
            leftWaterLevel = 0;
            rightWaterLevel = 0;
            leftWeightFactor = 1.5;
            rightWeightFactor = 1.5;
            gameOver = false;
            angle = 0;
            return;
        }
    }

    const inButtonL =
        mouseX > buttonRX && mouseX < buttonRX + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight;

    const inButtonR =
        mouseX > buttonLX && mouseX < buttonLX + buttonWidth && 
        mouseY > buttonY && mouseY < buttonY + buttonHeight

    if (inButtonL) {
        leftWeightFactor = random(1.0, 1.5);
        leftWaterLevel = min(leftWaterLevel + 10, 100);

    } else if (inButtonR) {
        rightWeightFactor = random(1.0, 1.5);
        rightWaterLevel = min(rightWaterLevel + 10, 100);
    }
}

/*
* Here are the changes I want to implement (1) make the water turn
* blue once a state of equilibrium is reached. If one of the tanks
* become full before equilibrium is reached then the screan fills 
* gradually with blood symbolizing and a restart button shows up. 
* (2) change the button to a faucet. (3) introduce randomness to 
* the weight of a button click after each click and store that in 
* an array. Does this plan answer all requirements ?
*/

