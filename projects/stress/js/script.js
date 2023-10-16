/**
 * Title of Project
 * Author Name
 * 
 * This is a template. You must fill in the title, author, 
 * and this description to match your project!
 */

"use strict";

// Global variables declaration
let root;
let branches = [];
let canCreateNewBranches = true;

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

    // Start at the bottom center
    const start = createVector(width / 2, height); 

    // End point of the root
    const end = createVector(width / 2, height - 100); 
    
    // Create the root branch
    root = new Branch(start, end, 0); 

    // Add it to the array
    branches.push(root); 
}


/**
 * Description of draw()
*/
function draw() {
    background(255);

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

                // limiting the depth of branches
                if (branches[i].depth < 6) { 

                    // branch to the right
                    let branchA = branches[i].branch(PI / 4);

                    // branch to the left
                    let branchB = branches[i].branch(-PI / 4);
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
        direction.mult(0.67); 

        // Find the end point of the new branch
        const newEnd = p5.Vector.add(this.end, direction); 

        // Return the new branch
        return new Branch(this.end, newEnd, this.depth + 1); 
    }
}