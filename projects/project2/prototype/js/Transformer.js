class Transformer {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle; // This is the angle of the rectangle itself
    }

    // Method to draw the rectangle
    draw() {
        push(); // Save the current drawing state
        translate(this.x, this.y);
        rotate(this.angle * Math.PI / 180);
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop(); // Restore the original drawing state
    }

    // Collision detection with a note
    collidesWith(note) {
        // Translate note position to rectangle's coordinate space
        let translatedX = note.x - this.x;
        let translatedY = note.y - this.y;

        // Rotate the point in the opposite direction of the rectangle
        let rotatedX = translatedX * Math.cos(-this.angle * Math.PI / 180) - translatedY * Math.sin(-this.angle * Math.PI / 180);
        let rotatedY = translatedX * Math.sin(-this.angle * Math.PI / 180) + translatedY * Math.cos(-this.angle * Math.PI / 180);

        // Perform AABB collision check in rectangle's coordinate space
        let halfWidth = this.width / 2;
        let halfHeight = this.height / 2;
        return rotatedX >= -halfWidth && rotatedX <= halfWidth && rotatedY >= -halfHeight && rotatedY <= halfHeight;
    }
}