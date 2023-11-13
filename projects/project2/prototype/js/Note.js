class Note {
    constructor (startX, startY, endX, endY, angle, stroke, space) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.angle = angle;
        this.stroke = stroke;
        this.dashLength = dashLength;
        this.space = space;
        this.notes = [];
    }


    // Initialize an array of notes
    initialize() {
        for (let i = this.startY; i <= this.endY; i += this.space + this.dashLength) {
            this.notes.push({x: this.startX, y:i})
        }
    }
    
    // Draw dashed lines
    draw () {
        strokeWeight(this.stroke);
        for (let note of this.notes) {
            line(note.x, note.y, note.x, note.y + this.dashLength);
        }
    }

    // Moves note loop from start to end point
    // Issue the space between the first and last point
    // implementing the 
    move () {
        for (let note of this.notes) {
            note.y += 1;
            if (note.y > this.endY) {
                note.y = this.startY - this.dashLength;
            }
        }
    }
}