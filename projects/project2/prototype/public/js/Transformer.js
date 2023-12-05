class Transformer {
    constructor(x, y, width, height, angle) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    playSynthNote() {
        if (!audioInitialized) return;

        let note = 'C4';
        let velocity = 0.5;
        let time = 0;
        let duration = 1;
        // synth.play(note, velocity, time, duration);
    }

    // Method to draw the rectangle
    draw() {
        push(); // Save the current drawing state
        translate(this.x, this.y);
        rotate(this.angle * Math.PI / 180);
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop(); // Restore the original drawing state

        // if (frameCount % 60 === 0) { // Every second, as an example
        //     this.playSynthNote();
        // }
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

    mousePressed(px, py) {
        if (this.mouseOver(px, py)) {
            this.isDragging = true;
            this.offsetX = this.x - px;
            this.offsetY = this.y - py;
        }
    }

    mouseDragged(px, py) {
        if (this.isDragging) {
            this.x = px + this.offsetX;
            this.y = py + this.offsetY;
        }
    }

    mouseReleased() {
        this.isDragging = false;
        note.checkCollisionAndReflect(this);
        console.log("Mouse released");
    }

    mouseOver(px, py) {
        // Check if mouse is over the rectangle
        return px > this.x - this.width / 2 && 
               px < this.x + this.width / 2 &&
               py > this.y - this.height / 2 && 
               py < this.y + this.height / 2;
    } 
}