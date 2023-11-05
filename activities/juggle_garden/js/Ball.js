class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 2;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.maxSpeed = 10;
        this.size = 40;
        this.active = true;
    }

    gravity(force) {
        this.ay = this.ay + force;
    }

    move() {
        this.vx = this.vx + this.ax;
        this.vy = this.vy + this.ay;

        this.vx = constrain(this.vx, -this.maxSpeed, this.maxSpeed);
        this.vy = constrain(this.vy, -this.maxSpeed, this.maxSpeed);

        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }

    bounce(paddle) {
        let collided = false;
        let normal;

        if (this.x > paddle.x - paddle.width/2 && 
            this.x < paddle.x + paddle.width/2 &&
            this.y + this.size/2 > paddle.y - paddle.height/2 &&
            this.y - this.size/2 < paddle.y + paddle.height/2) {

            // Top side
            if (this.vy > 0 && this.y - this.size/2 < paddle.y) {
                normal = [0, -1];
                collided = true;
            } 
            
            // Bottom side
            else if (this.vy < 0 && this.y + this.size/2 > paddle.y) {
                normal = [0, 1];
                collided = true;
            }

            // Left side
            if (this.vx > 0 && this.x - this.size/2 < paddle.x) {
                normal = [-1, 0];
                collided = true;
            } 
            
            // Right side
            else if (this.vx < 0 && this.x + this.size/2 > paddle.x) {
                normal = [1, 0];
                collided = true;
            }

            if (collided) {
                let dotProduct = this.vx * normal[0] + this.vy * normal[1];
                this.vx -= 2 * dotProduct * normal[0];
                this.vy -= 2 * dotProduct * normal[1];
                this.ay = 0;
                this.ax = 0;
            }
        }

        // Bounce off exterior walls
        // Bottom or Top wall
        if (this.y - this.size/2 >= height ||
            this.y + this.size/2 <= 0 ) {

            let normal = [0, 1];
            let dotProduct = this.vx * normal[0] + this.vy * normal[1];
            this.vx -= 2 * dotProduct * normal[0];
            this.vy -= 2 * dotProduct * normal[1];
            this.ay = 0;
        }

        // Left or Right wall
        if (this.x - this.size/2 <= 0 ||
            this.x + this.size/2 >= width) {

            let normal = [1, 0];
            let dotProduct = this.vx * normal[0] + this.vy * normal[1];
            this.vx -= 2 * dotProduct * normal[0];
            this.vy -= 2 * dotProduct * normal[1];
            this.ax = 0;
        }
    }




    display() {
        push();
        fill(255, 50, 50);
        stroke(0);
        ellipse(this.x, this.y, this.size);
        pop();
    }
}
