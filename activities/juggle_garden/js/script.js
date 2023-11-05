/**
 * Focus
 * Nadine Mohamed
 * 
 * Sometimes in our eagerness to grow, we overlook the essence of balance.
 */

"use strict";
let gravityForce = 0.002;
let paddle;
let balls = [];
let flowers = [];
let numFlowers = 5;
let numBalls = 2;
let gameState = "landing";
let clicks = 0;


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

    if (gameState === "landing") {
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Keep the flowers alive!", windowWidth / 2, windowHeight / 2 - 100);
        text("When 5 flowers bloom, you win.", windowWidth / 2, windowHeight / 2 - 60);
        text("If all spouts die before 5 bloom, it's game over.", windowWidth / 2, windowHeight / 2 - 20);
        text("Maximum of two clicks to plant seeds.", windowWidth / 2, windowHeight / 2 + 20);
        text("Click to Start", windowWidth / 2, windowHeight / 2 + 80);
        return;
    }
    
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

                    // Create new flower
                    let newX = random(0, width);
                    let newY = random(0, height);
                    let newFlower = new Flower(newX, newY);
                    flowers.push(newFlower);


                    flowers.splice(j, 1);
                    continue;
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
        background(0, 255, 0);
        fill(255);
        textSize(32);
        text("Click to Restart", windowWidth / 2 - 100, windowHeight / 2);
        return;
    }
}

function mousePressed() {

    if (gameState === "landing") {
        gameState = "playing";
        return;
    }

    if (gameState == "win" || gameState == "gameover") {
        
        // Reset everything
        gameState = "playing";
        balls = [];
        flowers = [];
        clicks = [];

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
    } else if (clicks < 4) {
        let newFlower = new Flower(mouseX, mouseY);
        flowers.push(newFlower);
        clicks++;
    }
}