class MovingCircle {
    constructor(startX, startY, speed, radius) {
        this.x = startX;
        this.y = startY;
        this.speed = speed;
        this.radius = radius;
    }
    
    // Draw the circles
    draw() {
        fill(255);
        noStroke();
        circle(this.x, this.y, this.radius * 2);
    }

    // Moves object loop from start to end point
    move() {
        this.x += this.speed;
        this.y += random(-2, 2);

            // Reset position if it goes off screen
            if (this.x > windowWidth) {
                this.x = 0;
            }
        }

    isOffScreen(note) {
        return note.x < 0 || note.x > windowWidth || note.y < 0 || note.y > windowHeight;
    }
}