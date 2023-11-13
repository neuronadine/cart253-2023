class Note {
    constructor (startX, startY, endX, endY, angle, stroke, dashLength, space) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.angle = angle;
        this.stroke = stroke;
        this.dashLength = dashLength;
        this.space = space;
        this.notes = [];

        // Calculate x and y increments based on angle
        this.dx = Math.cos(this.angle * Math.PI / 180);
        this.dy = Math.sin(this.angle * Math.PI / 180);
    }

    // Initialize an array of notes
    initialize() {

        // calculates total distance to cover
        let distance = Math.sqrt(Math.pow(this.endX - this.startX, 2) + Math.pow(this.endY - this.startY, 2));
        for (let i = 0; i <= distance; i += this.space + this.dashLength) {
            let x = this.startX + i * this.dx;
            let y = this.startY + i * this.dy;
            this.notes.push({x: x, y});
        }
    }
    
    // Draw dashed lines
    draw () {
        strokeWeight(this.stroke);
        for (let note of this.notes) {
            let endX = note.x + this.dashLength * this.dx;
            let endY = note.y + this.dashLength * this.dy;

            line(note.x, note.y, endX, endY);
        }
    }

    // Moves note loop from start to end point
    // implementing the 
    move () {
        for (let note of this.notes) {
            note.x += this.dx;
            note.y += this.dy;

            // Check if note goes beyond the end point
            if ((this.dx > 0 && note.x > this.endX) || (this.dx < 0 && note.x < this.endX) ||
                (this.dy > 0 && note.y > this.endY) || (this.dy < 0 && note.y < this.endY)) {
                note.x = this.startX;
                note.y = this.startY;
            }
        }
    }
}