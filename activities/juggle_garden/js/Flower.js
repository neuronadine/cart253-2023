class Flower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.growthRate = 2;
        this.isBloomed = false;
        this.maxSize = 40;
        this.color = color(100, 200, 100);
        this.bloomColor = color(255, 100, 100);
        this.lifetime = 5000; //5 seconds
        this.timeSinceLastNourished = 0;
        this.witherTimer = 0;
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
        this.witherTimer = 0;
    }

    update() {
        this.timeSinceLastNourished += deltaTime;
        this.witherTimer += deltaTime;

        // Start withering
        if (this.timeSinceLastNourished > this.lifetime) {
            while(this.witherTimer >= 1000) {
                this.size -= 1;
                this.witherTimer -= 1500;
            }
            if (this.size <= 1) {
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
        if (this.size >= this.maxSize) {
            return true;
        } else return false;
    }

    hasWithered() {
        return !this.isBloomed &&this.size <= 1;
    }
}
