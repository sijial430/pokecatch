// Game constants
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const FPS = 60;

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make sure canvas dimensions are set correctly
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

// Game variables
let score = 0;
let player = null;
let pokemonList = [];
let pokeball = null;
let pokeballThrown = false;
let catching = false;
let caughtPokemon = null;
let catchingTimer = 0;
let spawnTimer = 0;

// Keyboard state
const keys = {
    left: false,
    right: false,
    space: false
};

// Initialize the game
function init() {
    // Create player
    player = new Player(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);
    
    // Set up event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Mobile/touch controls
    setupTouchControls();
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Handle keydown events
function handleKeyDown(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case ' ':
            if (!pokeballThrown && !catching) {
                throwPokeball();
            }
            keys.space = true;
            break;
    }
    
    // Prevent scrolling when using arrow keys
    if(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
    }
}

// Handle keyup events
function handleKeyUp(e) {
    switch(e.key) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case ' ':
            keys.space = false;
            break;
    }
}

// Setup touch controls for mobile devices
function setupTouchControls() {
    // Add touch controls on the canvas
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const canvasRect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - canvasRect.left;
        
        // Left third of screen moves left, right third moves right, middle throws ball
        if (touchX < canvas.width / 3) {
            keys.left = true;
            keys.right = false;
        } else if (touchX > (canvas.width * 2) / 3) {
            keys.left = false;
            keys.right = true;
        } else {
            if (!pokeballThrown && !catching) {
                throwPokeball();
            }
        }
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys.left = false;
        keys.right = false;
    });
}

// Throw a pokeball
function throwPokeball() {
    pokeball = {
        x: player.x,
        y: player.y,
        speed: -10
    };
    pokeballThrown = true;
}

// Update the game state
function update() {
    // Handle player movement
    if (keys.left) {
        player.move(-5, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    if (keys.right) {
        player.move(5, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    
    // Spawn Pokemon randomly
    spawnTimer++;
    if (spawnTimer > 120 && pokemonList.length < 3 && !catching) {
        pokemonList.push(new Pokemon(
            Math.random() * (SCREEN_WIDTH - 100) + 50,
            Math.random() * (SCREEN_HEIGHT / 2 - 50) + 50
        ));
        spawnTimer = 0;
    }
    
    // Update Pokemon positions
    for (const pokemon of pokemonList) {
        pokemon.update();
    }
    
    // Update Pokeball
    if (pokeballThrown && !catching) {
        pokeball.y += pokeball.speed;
        
        // Check if Pokeball hits a Pokemon
        for (let i = 0; i < pokemonList.length; i++) {
            const pokemon = pokemonList[i];
            if (Math.abs(pokeball.x - pokemon.x) < 30 && 
                Math.abs(pokeball.y - pokemon.y) < 30) {
                catching = true;
                caughtPokemon = pokemon;
                pokemonList.splice(i, 1);
                break;
            }
        }
        
        // Check if Pokeball is off-screen
        if (pokeball.y < 0) {
            pokeballThrown = false;
        }
    }
    
    // Handle catching animation
    if (catching) {
        catchingTimer++;
        if (catchingTimer > 120) {  // 2 seconds
            score++;
            document.getElementById('score').textContent = score;
            catching = false;
            caughtPokemon = null;
            catchingTimer = 0;
            pokeballThrown = false;
        }
    }
}

// Draw everything
function draw() {
    // Clear the canvas
    ctx.fillStyle = '#F8F8F8';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Draw Pokemon
    for (const pokemon of pokemonList) {
        pokemon.draw(ctx);
    }
    
    // Draw player
    player.draw(ctx);
    
    // Draw Pokeball
    if (pokeballThrown) {
        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.arc(pokeball.x, pokeball.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.moveTo(pokeball.x - 10, pokeball.y);
        ctx.lineTo(pokeball.x + 10, pokeball.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(pokeball.x, pokeball.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw catching animation
    if (catching) {
        // Draw the caught Pokemon
        caughtPokemon.draw(ctx);
        
        // Draw Pokeball over Pokemon
        ctx.beginPath();
        ctx.fillStyle = '#FF0000';
        ctx.arc(caughtPokemon.x, caughtPokemon.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.moveTo(caughtPokemon.x - 15, caughtPokemon.y);
        ctx.lineTo(caughtPokemon.x + 15, caughtPokemon.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(caughtPokemon.x, caughtPokemon.y, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // Shake animation
        if (catchingTimer % 20 < 10) {
            ctx.beginPath();
            ctx.fillStyle = '#00FF00';
            ctx.arc(caughtPokemon.x + 5, caughtPokemon.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Main game loop
function gameLoop() {
    update();
    draw();
    
    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game when the page loads
window.addEventListener('load', init); 