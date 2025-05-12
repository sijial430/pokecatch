class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 60;
        this.color = '#3050F0';  // Blue
    }

    move(dx, dy, screenWidth, screenHeight) {
        // Move the player and keep them within the screen boundaries
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        if (newX >= 0 && newX <= screenWidth - this.width) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= screenHeight - this.height) {
            this.y = newY;
        }
    }

    draw(ctx) {
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        
        // Head
        ctx.beginPath();
        ctx.fillStyle = '#FFCC99';  // Skin tone
        ctx.arc(this.x, this.y - this.height / 2 - 15, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Hat
        ctx.fillStyle = '#FF0000';  // Red
        ctx.fillRect(this.x - 20, this.y - this.height / 2 - 35, 40, 10);
        ctx.fillRect(this.x - 10, this.y - this.height / 2 - 45, 20, 10);
        
        // Arms
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2 - 10, this.y - 10, 10, 30);
        ctx.fillRect(this.x + this.width / 2, this.y - 10, 10, 30);
    }
} 