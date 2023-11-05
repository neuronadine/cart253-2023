/**
 * Title of Project
 * Author Name
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";
let gravityForce = 0.002;
let paddle;
let balls = [];
let numBalls = 3;

function preload() {

}

function setup() {

    createCanvas(windowWidth, windowHeight);
    paddle = new Paddle(100, 100);

    for (let i = 0; i < numBalls; i++) {
        let x = random(0, width);
        let y = random(-400, -100);
        let ball = new Ball(x, y);
        balls.push(ball);
    }
}


function draw() {
    background(0);
    
    paddle.move();
    paddle.display();

    for ( let i = 0; i < balls.length; i++) {
        let ball = balls[i];

        if (ball.active) {
            ball.gravity(gravityForce);
            ball.move();
            ball.bounce(paddle);
            ball.display();
        }
        
    }
}