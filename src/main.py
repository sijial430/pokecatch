import pygame
import sys
import random
from player import Player
from pokemon import Pokemon

# Initialize pygame
pygame.init()

# Game constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)

# Create the game window
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Pokemon Catch")
clock = pygame.time.Clock()

# Game variables
score = 0
font = pygame.font.SysFont(None, 36)

def main():
    global score
    player = Player(SCREEN_WIDTH // 2, SCREEN_HEIGHT - 100)
    pokemon_list = []
    pokeball = None
    pokeball_thrown = False
    catching = False
    caught_pokemon = None
    catching_timer = 0
    spawn_timer = 0
    
    # Main game loop
    running = True
    while running:
        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and not pokeball_thrown and not catching:
                    pokeball = {"x": player.x, "y": player.y, "speed": -10}
                    pokeball_thrown = True
        
        # Get keyboard state
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            player.move(-5, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        if keys[pygame.K_RIGHT]:
            player.move(5, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        
        # Spawn Pokemon randomly
        spawn_timer += 1
        if spawn_timer > 120 and len(pokemon_list) < 3 and not catching:
            pokemon_list.append(Pokemon(random.randint(50, SCREEN_WIDTH - 50), 
                                       random.randint(50, SCREEN_HEIGHT // 2)))
            spawn_timer = 0
        
        # Update Pokemon positions
        for pokemon in pokemon_list:
            pokemon.update()
        
        # Update Pokeball
        if pokeball_thrown and not catching:
            pokeball["y"] += pokeball["speed"]
            
            # Check if Pokeball hits a Pokemon
            for i, pokemon in enumerate(pokemon_list):
                if (abs(pokeball["x"] - pokemon.x) < 30 and 
                    abs(pokeball["y"] - pokemon.y) < 30):
                    catching = True
                    caught_pokemon = pokemon
                    pokemon_list.pop(i)
                    break
            
            # Check if Pokeball is off-screen
            if pokeball["y"] < 0:
                pokeball_thrown = False
        
        # Handle catching animation
        if catching:
            catching_timer += 1
            if catching_timer > 120:  # 2 seconds
                score += 1
                catching = False
                caught_pokemon = None
                catching_timer = 0
                pokeball_thrown = False
        
        # Draw everything
        screen.fill(WHITE)
        
        # Draw Pokemon
        for pokemon in pokemon_list:
            pokemon.draw(screen)
        
        # Draw player
        player.draw(screen)
        
        # Draw Pokeball
        if pokeball_thrown:
            pygame.draw.circle(screen, (255, 0, 0), (int(pokeball["x"]), int(pokeball["y"])), 10)
            pygame.draw.line(screen, BLACK, (pokeball["x"] - 10, pokeball["y"]), 
                           (pokeball["x"] + 10, pokeball["y"]), 2)
            pygame.draw.circle(screen, WHITE, (int(pokeball["x"]), int(pokeball["y"])), 5)
        
        # Draw catching animation
        if catching:
            # Draw the caught Pokemon
            caught_pokemon.draw(screen)
            # Draw Pokeball over Pokemon
            pygame.draw.circle(screen, (255, 0, 0), 
                             (int(caught_pokemon.x), int(caught_pokemon.y)), 15)
            pygame.draw.line(screen, BLACK, 
                           (caught_pokemon.x - 15, caught_pokemon.y),
                           (caught_pokemon.x + 15, caught_pokemon.y), 2)
            pygame.draw.circle(screen, WHITE, 
                             (int(caught_pokemon.x), int(caught_pokemon.y)), 7)
            
            # Shake animation
            if catching_timer % 20 < 10:
                pygame.draw.circle(screen, GREEN, 
                                 (int(caught_pokemon.x + 5), int(caught_pokemon.y)), 3)
        
        # Draw score
        score_text = font.render(f"Pokemon Caught: {score}", True, BLACK)
        screen.blit(score_text, (10, 10))
        
        # Update the display
        pygame.display.flip()
        clock.tick(FPS)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main() 