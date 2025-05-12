import pygame

class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.width = 50
        self.height = 60
        self.color = (0, 0, 255)  # Blue
    
    def move(self, dx, dy, screen_width, screen_height):
        # Move the player and keep them within the screen boundaries
        new_x = self.x + dx
        new_y = self.y + dy
        
        if new_x >= 0 and new_x <= screen_width - self.width:
            self.x = new_x
        if new_y >= 0 and new_y <= screen_height - self.height:
            self.y = new_y
    
    def draw(self, screen):
        # Draw a simple representation of the player (a trainer)
        # Body
        pygame.draw.rect(screen, self.color, 
                        (self.x - self.width // 2, self.y - self.height // 2, 
                         self.width, self.height))
        
        # Head
        pygame.draw.circle(screen, (255, 200, 150), 
                         (int(self.x), int(self.y - self.height // 2 - 15)), 15)
        
        # Hat
        pygame.draw.rect(screen, (255, 0, 0), 
                       (self.x - 20, self.y - self.height // 2 - 35, 40, 10))
        pygame.draw.rect(screen, (255, 0, 0), 
                       (self.x - 10, self.y - self.height // 2 - 45, 20, 10))
        
        # Arms
        pygame.draw.rect(screen, self.color, 
                       (self.x - self.width // 2 - 10, self.y - 10, 10, 30))
        pygame.draw.rect(screen, self.color, 
                       (self.x + self.width // 2, self.y - 10, 10, 30)) 