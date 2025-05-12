class Pokemon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.dx = this.getRandomDirection(-2, 2);
        this.dy = this.getRandomDirection(-1, 1);
        this.pokemon_type = this.getRandomType();
        this.color = this.getTypeColor();
        this.moveTimer = 0;
    }

    getRandomDirection(min, max) {
        let val = 0;
        while (val === 0) {
            val = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return val;
    }

    getRandomType() {
        const types = ["normal", "fire", "water", "grass", "electric"];
        return types[Math.floor(Math.random() * types.length)];
    }

    getTypeColor() {
        const colors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            grass: '#78C850',
            electric: '#F8D030'
        };
        return colors[this.pokemon_type] || '#A8A878';
    }

    update() {
        // Move the Pokemon
        this.x += this.dx;
        this.y += this.dy;
        
        // Bounce off edges
        if (this.x < 20 || this.x > 780) {
            this.dx *= -1;
        }
        if (this.y < 20 || this.y > 300) {
            this.dy *= -1;
        }
        
        // Randomly change direction
        this.moveTimer++;
        if (this.moveTimer > 60) {  // Every ~1 second
            if (Math.random() < 0.3) {  // 30% chance to change direction
                this.dx = this.getRandomDirection(-2, 2);
                this.dy = this.getRandomDirection(-1, 1);
            }
            this.moveTimer = 0;
        }
    }

    draw(ctx) {
        // Draw the body
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw eyes
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.x - 7, this.y - 5, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 7, this.y - 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.x - 7, this.y - 5, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 7, this.y - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y + 5, 10, 0, Math.PI);
        ctx.stroke();
        
        // Draw type-specific details
        switch(this.pokemon_type) {
            case 'fire':
                // Flame on top
                ctx.beginPath();
                ctx.fillStyle = '#FF7F00';
                ctx.moveTo(this.x, this.y - this.size / 2 - 10);
                ctx.lineTo(this.x - 5, this.y - this.size / 2);
                ctx.lineTo(this.x + 5, this.y - this.size / 2);
                ctx.fill();
                break;
                
            case 'water':
                // Water droplet
                ctx.beginPath();
                ctx.fillStyle = '#00BFFF';
                ctx.arc(this.x, this.y + this.size / 2, 5, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'grass':
                // Leaf
                ctx.beginPath();
                ctx.fillStyle = '#228B22';
                ctx.ellipse(this.x, this.y - this.size / 2 - 5, 5, 7.5, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'electric':
                // Lightning bolt
                ctx.beginPath();
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 2;
                ctx.moveTo(this.x, this.y - this.size / 2);
                ctx.lineTo(this.x + 5, this.y - this.size / 2 + 7);
                ctx.lineTo(this.x - 2, this.y - this.size / 2 + 10);
                ctx.stroke();
                break;
        }
    }
} 