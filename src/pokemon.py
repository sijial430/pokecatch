import pygame
import random

class Pokemon:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.size = 40
        self.color = self.random_color()
        self.dx = random.choice([-2, -1, 1, 2])
        self.dy = random.choice([-1, 1])
        self.pokemon_type = random.choice(["normal", "fire", "water", "grass", "electric"])
        self.move_timer = 0
    
    def random_color(self):
        """Generate a random color for the Pokemon."""
        colors = [
            (255, 0, 0),      # Red (Fire)
            (0, 0, 255),      # Blue (Water)
            (0, 255, 0),      # Green (Grass)
            (255, 255, 0),    # Yellow (Electric)
            (165, 42, 42),    # Brown (Ground)
            (255, 105, 180),  # Pink (Fairy)
            (128, 0, 128),    # Purple (Poison)
            (192, 192, 192),  # Silver (Steel)
            (255, 215, 0)     # Gold (Psychic)
        ]
        return random.choice(colors)
    
    def update(self):
        """Update the Pokemon's position and movement."""
        # Move the Pokemon
        self.x += self.dx
        self.y += self.dy
        
        # Bounce off the edges of the screen
        if self.x < 20 or self.x > 780:
            self.dx *= -1
        if self.y < 20 or self.y > 300:
            self.dy *= -1
        
        # Randomly change direction occasionally
        self.move_timer += 1
        if self.move_timer > 60:  # Every ~1 second
            if random.random() < 0.3:  # 30% chance to change direction
                self.dx = random.choice([-2, -1, 1, 2])
                self.dy = random.choice([-1, 1])
            self.move_timer = 0
    
    def draw(self, screen):
        """Draw the Pokemon on the screen."""
        # Body
        pygame.draw.circle(screen, self.color, (int(self.x), int(self.y)), self.size // 2)
        
        # Eyes
        eye_color = (255, 255, 255)
        pygame.draw.circle(screen, eye_color, (int(self.x - 7), int(self.y - 5)), 5)
        pygame.draw.circle(screen, eye_color, (int(self.x + 7), int(self.y - 5)), 5)
        
        # Pupils
        pupil_color = (0, 0, 0)
        pygame.draw.circle(screen, pupil_color, (int(self.x - 7), int(self.y - 5)), 2)
        pygame.draw.circle(screen, pupil_color, (int(self.x + 7), int(self.y - 5)), 2)
        
        # Mouth
        pygame.draw.arc(screen, (0, 0, 0), (self.x - 10, self.y, 20, 10), 0, 3.14, 2)
        
        # Add type-specific details
        if self.pokemon_type == "fire":
            # Flame on top
            pygame.draw.polygon(screen, (255, 128, 0), 
                              [(self.x, self.y - self.size // 2 - 10),
                               (self.x - 5, self.y - self.size // 2),
                               (self.x + 5, self.y - self.size // 2)])
        elif self.pokemon_type == "water":
            # Water droplet
            pygame.draw.circle(screen, (0, 191, 255), 
                             (int(self.x), int(self.y + self.size // 2)), 5)
        elif self.pokemon_type == "grass":
            # Leaf
            pygame.draw.ellipse(screen, (34, 139, 34), 
                              (self.x - 5, self.y - self.size // 2 - 10, 10, 15))
        elif self.pokemon_type == "electric":
            # Lightning bolt
            pygame.draw.line(screen, (255, 255, 0), 
                           (self.x, self.y - self.size // 2),
                           (self.x + 5, self.y - self.size // 2 + 7), 2)
            pygame.draw.line(screen, (255, 255, 0), 
                           (self.x + 5, self.y - self.size // 2 + 7),
                           (self.x - 2, self.y - self.size // 2 + 10), 2) 