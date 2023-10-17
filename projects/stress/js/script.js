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

    // Draw growth points - REMOVE
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

        // Stores branches grown in this cycle
        let newBranches = [];

        for (let branch of branches) {
            if (!branch.finished) {

                // Grow towards the closest point
                // IMP - NEEDS TO BE DEFINED
                let closestPoint = findClosestPoint(branch.end);

                if (closestPoint) {
                    let newBranch = branch.growTowards(closestPoint);
                    newBranches.push(newBranch);
                    growthPoints = growthPoints.filter(point => point !== closestPoint);
                }

                // This branch won't grow further
                branch.finished = true; 
            }
        }

        // Add new branches to the main list
        branches.push(...newBranches);

        // Use setTimeout to allow new branches after some time has passed
        setTimeout(() => {
            canCreateNewBranches = true;
        }, 500);
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
    branch(angle) {

        // Find the nearest growth point to the current branch
        let closestGrowthPoint = null;
        let closestDistance = Infinity;
        let closestGrowthPointIndex = -1;

        for (let i = 0; i < growthPoints.length; i++) {
            let d = dist(growthPoints[i].x, growthPoints[i].y, this.end.x, this.end.y);

            if (d < closestDistance) {
                closestDistance = d;
                closestGrowthPoint = growthPoints[i];
                closestGrowthPointIndex = i;
            }
        }

        if (closestGrowthPointIndex != -1) {
            growthPoints.splice(closestGrowthPointIndex, 1);
        }

        // Find the direction the the nearest growth point
        let direction;
        if (closestGrowthPoint != null) {
            direction = p5.Vector.sub(closestGrowthPoint, this.end);
        } else {
            direction = p5.Vector.sub(this.end, this.start); 
        }
        
        // Rotate by a certain angle
        direction.rotate(angle); 

        // Reduce the length for the next branch
        direction.mult(random(0.55, 0.85)); 

        // Calculate the newEnd based on the direction to the nearest growth.
        const newEnd = p5.Vector.add(this.end, direction); 

        // Return the new branch
        return new Branch(this.end, newEnd, this.depth + 1); 
    }

    growTowards(point) {
        // Vector pointing from the branch tip to the point
        let dir = p5.Vector.sub(point, this.end);

        // You might want to normalize the vector so that all branches grow at a consistent rate
        dir.normalize();

        // Adjust this to control the growth speed
        dir.mult(2); 

        // Create the new branch
        const newEnd = p5.Vector.add(this.end, dir);

        // New branch with incremented depth
        return new Branch(this.end, newEnd, this.depth + 1);
    }

}

// Function to find the closest growth point to a given position
function findClosestPoint(position) {
    // this function should return the closest growth point to the provided position
    let closest = null;
    let closestDist = Infinity;

    for (let point of growthPoints) {
        let d = p5.Vector.dist(position, point);
        if (d < closestDist) {
            closestDist = d;
            closest = point;
        }
    }

    return closest;  // may be null if no points are left
}