class SoundTriggerBar {
    constructor(y, height) {
        this.x = 0;
        this.y = y;
        this.width = windowWidth;
        this.height = height;
    }

    // Method to draw the bar
    draw() {
        fill(255);
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }

    // Checks if a note touches the bar
    collidesWith(note) {
        return note.y + note.radius > this.y && note.y - note.radius < this.y + this.height;
    }

    playSynthNote() {
        let note = 'C4';
        let velocity = 0.5;
        let time = 0;
        let duration = 1;
        synth.play(note, velocity, time, duration);
    }
}