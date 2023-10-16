/**
 * Title of Project
 * Author Name
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";

// Global variables declaration
let branches = [];
let canCreateNewBranches = true;
let growthPoints = [];

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

    // Scatter Growth Points Accross the Canvas
    // Create a library to store scattered points
    for( let x = 0; x <= windowWidth; x += 50) {
        for (let y = 0; y <= windowHeight; y += 50) {
            let growthPoint = createVector(x, y);
            growthPoints.push(growthPoint);
        }
    }

    // Start at the bottom center
    const center = createVector(width /2, height / 2); 

    // Define directions for intial branches
    let rootBranches = [];

    rootBranches.push(p5.Vector.fromAngle(PI/4).mult(random(10, height / 4)));
    rootBranches.push(p5.Vector.fromAngle(-PI/4).mult(random(10, height / 4)));
    rootBranches.push(p5.Vector.fromAngle(3* PI / 4).mult(random(10, height / 4)));
    rootBranches.push(p5.Vector.fromAngle(-3* PI / 4).mult(random(10, height / 4)));

    // Create initial branches based on directions
    for (let branch of rootBranches) {
        let branchEnd = p5.Vector.add(center, branch);
        let newBranch = new Branch(center, branchEnd, 0);
        branches.push(newBranch);
    }
}

/**
 * Description of draw()
*/
function draw() {
    background(255);

    // TEST - draw growth points
    for (let growthPoint of growthPoints) {
        ellipse(growthPoint.x, growthPoint.y, 4, 4);
    }

    // Draw all branches, whether finished or not
    for (let branch of branches) {
        branch.show();
    }

    if (canCreateNewBranches) {
        // Temporarily stop new branches from being created
        canCreateNewBranches = false;

        // Create new branches
        for (let i = branches.length -1; i >=0; i--) {
            if (!branches[i].finished) {

                // limiting the depth of branches (this controls the complexity)
                if (branches[i].depth < 10) { 

                    // branch to the right
                    let branchA = branches[i].branch(PI / 4, random(0.5, 0.9));

                    // branch to the left
                    let branchB = branches[i].branch(-PI / 4, random(0.5, 0.9));
                    branches.push(branchA);
                    branches.push(branchB);
                }
            
                // prevent further branching from this branch
                branches[i].finished = true;
            }
        }
        // Use setTimeout to allow new branches after some time has passed
        setTimeout(() => {
            canCreateNewBranches = true;
        }, 500); // 500ms delay before new branches can be created
    }
}




class Branch {
    constructor(start, end, depth) {
        this.start = start;
        this.end = end;
        this.finished = false;
        this.depth = depth;
    }

    // Draws a new branch
    show() {
        stroke(0);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    // creates a new branch through an angle
    branch( angle) {

        // Get the direction of the current branch
        const direction = p5.Vector.sub(this.end, this.start); 
        
        // Rotate by a certain angle
        direction.rotate(angle); 

        // Reduce the length for the next branch
        direction.mult(random(0.55, 0.85)); 

        // Find the end point of the new branch
        const newEnd = p5.Vector.add(this.end, direction); 

        // Return the new branch
        return new Branch(this.end, newEnd, this.depth + 1); 
    }
}

