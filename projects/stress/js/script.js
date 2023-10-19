/**
 * Ruminations
 * Nadine Mohamed
 * 
 * Date : 19-10-2023
 */

"use strict";

// Global variables declaration
let branches = [];
let growthPoints = [];
let removedGrowthPoints = [];
let simulationStarted = false;

// Pre-setup, can be used for loading assets
function preload() {
}

// Initial setup function for p5
function setup() {
    createCanvas(windowWidth, windowHeight);
    titleScreen();
}

// Main Continous Drawing function 
function draw() {
    // Start Space Coloniztion
    if (simulationStarted) {
        background(242, 242, 242);
        spaceColonization();
        sprout();
    }
}

// Function to start simulation
function growthSimulation() {
    // Scratter Space Colonization Growth Points
    scatterGrowthPoints();

    // Create root branches at the center of the screen
    createRootBranches();
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
        stroke(0, 44, 99);
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

        // Normalize vectors so that all branches grow at a consistent rate
        dir.normalize();

        // Calculate the current branch's direction and length
        let currentBranchVector = p5.Vector.sub(this.end, this.start);
        let currentBranchLength = currentBranchVector.mag();

        // Randomize length of the new branch
        let newLength = currentBranchLength * random(0.55, 1.55);

        // Cap Maximum length
        newLength = min(newLength, 100);

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
    let closest = null;
    let closestDist = Infinity;

    for (let point of growthPoints) {
        let d = p5.Vector.dist(position, point);
        if (d < closestDist) {
            closestDist = d;
            closest = point;
        }
    }
    return closest;
}

// Function too initiate title screen
function titleScreen() {
    background(0, 44, 99);

    // Title
    textSize(24);
    fill(242, 242, 242);
    textAlign(LEFT, CENTER);
    text("Stress Tree", 0, windowHeight / 8, windowWidth - 40);

    // Preface
    textSize(14);
    fill(242, 242, 242);
    textAlign(LEFT, CENTER);
    text(`This simulation visualizes the complexity and persistence of anxious thoughts, with growth influenced by real-time brain signals during stress responses. As you interact with your clicks, ponder the nature of your influence on the unfolding patterns.`
            , 0, windowHeight / 2 - 100, windowWidth - 40);


    // Add Background Mouvement

    // Add Simulation button
    let button = createButton('Start Simulation');
    button.position(width/2 - button.size().width/2, height/2);
    button.mousePressed(initSimulation);
}

// Function to start simulation
function initSimulation() {
    simulationStarted = true;
    this.remove();
    growthSimulation();
}

function spaceColonization() {
    // Draw growth points and check for mouse collision
    for (let i = growthPoints.length - 1; i >= 0; i--) {
        let growthPoint = growthPoints[i];
        let distance = dist(mouseX, mouseY, growthPoint.x, growthPoint.y);

        if (distance <= 6) {
            // If the mouse is over the point, remove it from the array
            removedGrowthPoints.push(growthPoint);
            growthPoints.splice(i, 1);
        } else {
            // If not, draw the point as normal
            stroke(0, 255, 0);
            ellipse(growthPoint.x, growthPoint.y, 4, 4);
        }
    }

    // Draw removed growth points in red
    for (let removedPoint of removedGrowthPoints) {
        stroke(255, 0, 0);
        ellipse(removedPoint.x, removedPoint.y, 4, 4);
    }
}

function sprout() {
    // Draw all branches, whether finished or not
    for (let branch of branches) {
                branch.show();
            }
            
    if (frameCount % 10 == 0) {
        for (let i = branches.length -1; i >=0; i--) {
            let branch = branches[i];
            
            if (!branch.finished) {  
                // Random Space Colonization
                if (random(1.0) < 0.3 && branches[i].depth < 15) {
                    // Find closest removed growth point
                    let closestPoint = null;
                    let record = -1; // Using -1 to signify no point found yet
                    for (let j = 0; j < removedGrowthPoints.length; j++) {
                        let point = removedGrowthPoints[j];
                        let d = dist(point.x, point.y, branch.end.x, branch.end.y);
                        
                        if (record === -1 || d < record) {
                            closestPoint = point;
                            record = d;
                        }
                    }
    
                    // If a closest point was found among the removed points, grow towards it
                    if (closestPoint) {
                        let newBranch = branch.growTowards(closestPoint, this);
                        branches.push(newBranch);
                        removedGrowthPoints = removedGrowthPoints.filter(point => point !== closestPoint);
                    }
    
                    // Prevent further branching from this branch
                    branches[i].finished = true;
                        
                } else { 
                     proliferate(i);
                }   
            }
        }
    }
}

function proliferate(index) {
    // Grow two branches from parent and store to memory
    if (branches[index].depth < 15) {
        let branchA = branches[index].branch(PI / 4, this);
        let branchB = branches[index].branch(-PI / 4, this);

        branches.push(branchA);
        branches.push(branchB);
    }

    // Prevent further branching from parent
    branches[index].finished = true; 
}

function scatterGrowthPoints() {
    // Create a library to store scattered points
    for( let x = 0; x <= windowWidth; x += 10) {
        for (let y = 0; y <= windowHeight; y += 10) {
            let growthPoint = createVector(x, y);
            growthPoints.push(growthPoint);
        }
    }
}

function createRootBranches() {
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