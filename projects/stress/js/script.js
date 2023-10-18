/**
 * Ruminations
 * Nadine Mohamed
 * 
 * Date : 19-10-2023
 */

"use strict";

// Global variables declaration
let branches = [];
let canCreateNewBranches = true;
let growthPoints = [];
let branchesToEvaluate = [];

let previousMouseX = 0;
let previousMouseY = 0;
let mouseVelocity = 0;

let recentBranches = [];
let recentBranchesByFrame = new Map();

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

    // Create a library to store scattered points
    for( let x = 0; x <= windowWidth; x += 10) {
        for (let y = 0; y <= windowHeight; y += 10) {
            let growthPoint = createVector(x, y);
            growthPoints.push(growthPoint);
        }
    }

    // Start at the center of the screen
    const center = createVector(width /2, height / 2); 

    // Define directions for intial branches
    let rootBranches = [];

    rootBranches.push(p5.Vector.fromAngle(PI/4).mult(100));
    rootBranches.push(p5.Vector.fromAngle(-PI/4).mult(100));
    rootBranches.push(p5.Vector.fromAngle(3* PI / 4).mult(100));
    rootBranches.push(p5.Vector.fromAngle(-3* PI / 4).mult(100));

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
    // Calculate the mouse velocity
    let mouseMovedDistance = dist(mouseX, mouseY, previousMouseX, previousMouseY);
    mouseVelocity = mouseMovedDistance;

    // Update the previous mouse position for the next frame
    previousMouseX = mouseX;
    previousMouseY = mouseY;

    // Set background colour
    background(255);

    // Draw growth points
    for (let growthPoint of growthPoints) {
        stroke(0,255,0);
        ellipse(growthPoint.x, growthPoint.y, 2, 2);
    }

    // Draw all branches, whether finished or not
    for (let branch of branches) {
        branch.show();
    }

    // Remove recent branches based on mouse velocity
    if (mouseVelocity > 100) {
        // Filter out the branchesToRemove from the main branches array
        let branchesLastFrame = recentBranchesByFrame.get(frameCount - 1) || [];
        branches = branches.filter(branch => { //!branchesLastFrame.includes(branch));
            if (branchesLastFrame.includes(branch)) {
                if (branch.parent && !branch.parent.finished) {
                    branch.parent.resetFinished();
                }
                return false;
            }
            return true;
        });

        // Clear the record for the last frame to free up memory
        recentBranchesByFrame.delete(frameCount - 1);

        // Do not proceed to add new branches
        return;
    } 
    
    if (frameCount % 10 == 0) {
        // New branches stored here
        let branchesThisFrame = [];

        for (let i = branches.length -1; i >=0; i--) {
            let branch = branches[i];
            if (!branch.finished) {  

                // Random Space Colonization
                if (random(1.0) < 0.3 && branches[i].depth < 15) {

                // Find closest growth point
                let closestPoint = findClosestPoint(branch.end);
                    
                // Grow towards the closest point
                if (closestPoint) {
                    let newBranch = branch.growTowards(closestPoint, this);
                    branches.push(newBranch);
                    branchesThisFrame.push(newBranch);
                    growthPoints = growthPoints.filter(point => point !== closestPoint);
                }

                // Prevent further branching from this branch
                branches[i].finished = true;
                } else { // Branch prolifiration
                    if (branches[i].depth < 15) {
                        let branchA = branches[i].branch(PI / 4, this);
                        let branchB = branches[i].branch(-PI / 4, this);

                        branches.push(branchA);
                        branches.push(branchB);

                        // Instead of branches to evaluate, store in temp memory
                        branchesThisFrame.push(branchA);
                        branchesThisFrame.push(branchB);
                    }
                    // Prevent further branching from this branch
                    branches[i].finished = true; 
                }   
            }
        }

        // If any new branches were created this frame, store them in the map
        if (branchesThisFrame.length > 0) {
            recentBranchesByFrame.set(frameCount, branchesThisFrame);
        }
    }
}




class Branch {
    constructor(start, end, depth, parent) {
        this.start = start;
        this.end = end;
        this.finished = false;
        this.depth = depth;

        this.parent = parent;
    }

    // Draws a new branch
    show() {
        stroke(0);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }

    // creates a new branch through an angle
    branch(angle, parent) {
        // Get the direction of the current branch
        const direction = p5.Vector.sub(this.end, this.start); 

        // Rotate by a certain angle
        direction.rotate(angle); 

        // Reduce the length for the next branch
        direction.mult(random(0.55, 0.95)); 

        // Calculate the newEnd based on the direction to the nearest growth.
        const newEnd = p5.Vector.add(this.end, direction); 

        // Return the new branch
        return new Branch(this.end, newEnd, this.depth + 1, parent); 
    }

    growTowards(point, parent) {
        // Vector pointing from the branch tip to the point
        let dir = p5.Vector.sub(point, this.end);

        // You might want to normalize the vector so that all branches grow at a consistent rate
        dir.normalize();

        // Calculate the current branch's direction and length
        let currentBranchVector = p5.Vector.sub(this.end, this.start);
        let currentBranchLength = currentBranchVector.mag();

        // Set the length of the new branch to be 0.75 of the original branch's length
        let newLength = currentBranchLength * random(0.55, 0.75);

        // Scale the direction vector to maintain the growth towards the point
        dir.mult(newLength);

        // Create the new branch
        const newEnd = p5.Vector.add(this.end, dir);

        // New branch with incremented depth
        return new Branch(this.end, newEnd, this.depth + 1, parent);
    }

    resetFinished() {
        this.finished = false;
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