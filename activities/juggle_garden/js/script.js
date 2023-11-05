/**
 * Focus
 * Nadine Mohamed
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";
let gravityForce = 0.002;
let paddle;
let balls = [];
let flowers = [];
let numFlowers = 3;
let numBalls = 2;
let gameState = "playing";
function preload() {

}

function setup() {

    createCanvas(windowWidth, windowHeight);
    paddle = new Paddle(100, 100);

    for (let i = 0; i < numBalls; i++) {
        let x = random(1, width);
        let y = random(1, height/2);
        let ball = new Ball(x, y);
        balls.push(ball);
    }

    for (let i = 0; i < numFlowers; i++) {
        let x = random(0, width);
        let y = random(0, height);
        let flower = new Flower(x, y);
        flowers.push(flower);
    }
}


function draw() {
    background(0);
    
    paddle.move();
    paddle.display();

    for (let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        if (ball.active) {
            ball.gravity(gravityForce);
            ball.move();
            ball.bounce(paddle);
            ball.display();

            for (let j = flowers.length - 1; j >= 0; j--) {
                let flower = flowers[j];
        
                flower.checkCollision(ball);
                flower.update();
                flower.display();

                if (flower.hasBloomed()) {
                    let newBall = new Ball(flower.x, flower.y);
                    balls.push(newBall);
                    flowers.splice(j, 1);
                    // continue;
                }

                if (flower.hasWithered()) {
                    flowers.splice(j, 1);
                }
            }
        }
    }

    if (flowers.length == 0 && balls.length < 5) {
        gameState = "gameover";
    }
    
    if (balls.length >= 5) {
        gameState = "win";
    }
    
    if (gameState == "gameover") {
        background(255, 0, 0);
        fill(255);
        textSize(32);
        text("Game Over", windowWidth / 2 - 100, windowHeight / 2);
        return;
    }
    
    if (gameState == "win") {
        background(0, 255, 0); // green background
        fill(255);
        textSize(32);
        text("Click to Restart", windowWidth / 2 - 100, windowHeight / 2);
        return;
    }
}

function mousePressed() {

    if (gameState == "win") {
        // Reset everything
        gameState = "playing";
        balls = [];
        flowers = [];

        for (let i = 0; i < numBalls; i++) {
            let x = random(1, width);
            let y = random(1, height/2);
            let ball = new Ball(x, y);
            balls.push(ball);
        }

        for (let i = 0; i < numFlowers; i++) {
            let x = random(0, width);
            let y = random(0, height);
            let flower = new Flower(x, y);
            flowers.push(flower);
        }
    } else {
        let newFlower = new Flower(mouseX, mouseY);
        flowers.push(newFlower);
    }
}


// Limit the number of balls that can spawn
// Add the two endings : well the first ending is achieving the minmum number of flowers to grow
// 
// 
// cosmetics