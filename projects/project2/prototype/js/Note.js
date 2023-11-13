class Note {
    constructor (startX, startY, endX, endY, angle, weight, dashLength, space) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.globalAngle = angle;
        this.weight = weight;
        this.dashLength = dashLength;
        this.space = space;
        this.notes = [];

        this.initialize();

        // Calculate x and y increments based on angle
        // this.dx = Math.cos(this.angle * Math.PI / 180);
        // this.dy = Math.sin(this.angle * Math.PI / 180);
    }

    // Initialize an array of notes
    initialize() {
        let dx = Math.cos(this.globalAngle * Math.PI / 180);
        let dy = Math.sin(this.globalAngle * Math.PI / 180);
        let distance = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));


        // calculates total distance to cover
        for (let i = 0; i <= distance; i += this.space + this.dashLength) {
            let x = this.startX + i * dx;
            let y = this.startY + i * dy;
            this.notes.push({ x: x, y: y, dx: dx, dy: dy, angle: this.globalAngle });
        }
    }
    
    // Draw dashed lines
    draw () {
        stroke(255);
        strokeWeight(this.weight);
        for (let note of this.notes) {
            let endX = note.x + this.dashLength * note.dx;
            let endY = note.y + this.dashLength * note.dy;

            line(note.x, note.y, endX, endY);
        }
    }

    // Moves note loop from start to end point
    // implementing the 
    move () {
        for (let note of this.notes) {
            note.x += note.dx;
            note.y += note.dy;

            // Check if note goes beyond the end point
            if ((this.dx > 0 && note.x > this.endX + this.space) || (this.dx < 0 && note.x < this.startX - this.space) ||
                (this.dy > 0 && note.y > this.endY + this.space) || (this.dy < 0 && note.y < this.startY - this.space)) {
                
                    // Reset the note to start minus one dash length and space
                note.x = this.startX - this.dashLength * this.dx - this.space * this.dx;
                note.y = this.startY - this.dashLength * this.dy - this.space * this.dy;
            }
        }
    }

    checkCollisionAndReflect(rectangle) {
        for (let note of this.notes) {
            if (rectangle.collidesWith(note)) {

                // Reflect the note's angle based on the angle of incidence
                let reflectedAngle = 2 * rectangle.angle - note.angle;
                note.dx = Math.cos(reflectedAngle * Math.PI / 180);
                note.dy = Math.sin(reflectedAngle * Math.PI / 180);
                note.angle = reflectedAngle;
            }
        }
    }
}