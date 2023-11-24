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

        this.notes.forEach(note => note.hasCollided = false);
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
            if (this.isOffScreen(note)) {
                note.x = this.startX;
                note.y = this.startY;
                note.dx = Math.cos(this.globalAngle * Math.PI / 180);
                note.dy = Math.sin(this.globalAngle * Math.PI / 180);
                note.angle = this.globalAngle;
            }
        }
    }

    checkCollisionAndReflect(rectangle) {
        for (let note of this.notes) {
            let collides = rectangle.collidesWith(note);

            if (collides && !note.hasCollided) {
                let speed = Math.sqrt(note.dx * note.dx + note.dy * note.dy);
                osc.freq(speed * 20 + 200); 
                osc.amp(0.5, 0.1); 
                setTimeout(() => osc.amp(0), 100); 
                note.hasCollided = true;
            } else if (!collides) {
                note.hasCollided = false;
            }

            if (collides) {
                // Reflect the note's angle based on the angle of incidence
                let reflectedAngle = 2 * rectangle.angle - note.angle;
                note.dx = Math.cos(reflectedAngle * Math.PI / 180);
                note.dy = Math.sin(reflectedAngle * Math.PI / 180);
                note.angle = reflectedAngle;
                reflectSound.play(); // Play the reflection sound

                // Call the function to modify and generate music
                modifyAndGenerateMusic();
            }
        }
    }

    isOffScreen(note) {
        return note.x < 0 || note.x > windowWidth || note.y < 0 || note.y > windowHeight;
    }
}