class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.growthRate = 2;
        this.isBloomed = false;
        this.maxSize = 50;
        this.color = color(100, 200, 100);
        this.bloomColor = color(255, 100, 100);
        this.lifetime = 5000; //5 seconds
        this.timeSinceLastNourished = 0;
        this.witherRate = 0.5;
    }
    display() {
        push();
        fill(this.isBloomed ? this.bloomColor : this.color);
        ellipse(this.x, this.y, this.size);
        pop();
    }

    nourish() {
        this.size += this.growthRate;
        if(this.size >= this.maxSize) {
            this.size = this.maxSize;
            this.isBloomed = true;
        }
        this.timeSinceLastNourished = 0;
    }

    update() {
        this.timeSinceLastNourished += deltaTime;

        // Start withering
        if (this.isBloomed && this.timeSinceLastNourished > this.lifetime) {
            this.size -= this.witherRate;
            if (this.size < 10) {
                this.size = 10;
                this.isBloomed = false;
            }
        }
    }

    checkCollision(ball) {
        let distance = dist(this.x, this.y, ball.x, ball.y);
        if (distance < (this.size / 2) + (ball.size / 2)) {
            this.nourish();
        }
    }

    hasBloomed() {
        return this.size >= this.maxSize;
        }

    hasWithered() {
        return !this.isBloomed && this.size <= 10;
    }
}
