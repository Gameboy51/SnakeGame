import curses
import random

# Initialize the screen
stdscr = curses.initscr()
curses.curs_set(0)  # Hide the cursor
sh, sw = stdscr.getmaxyx()  # Get screen height and width
w = curses.newwin(sh, sw, 0, 0)  # Create a new window
w.keypad(1)  # Enable keypad mode to capture arrow key presses
w.timeout(100)  # Set the screen refresh rate (in ms)

# Initial snake position and body
snake_x = sw // 4
snake_y = sh // 2
snake = [
    [snake_y, snake_x],
    [snake_y, snake_x - 1],
    [snake_y, snake_x - 2]
]

# Initial food position
food = [sh // 2, sw // 2]
w.addch(food[0], food[1], curses.ACS_PI)  # Add food to the screen

# Initial game settings
key = curses.KEY_RIGHT
score = 0

# Game loop
while True:
    next_key = w.getch()
    key = key if next_key == -1 else next_key

    # Check for game over condition (if the snake hits the wall or itself)
    if (snake[0][0] in [0, sh] or  # Hits the screen border
            snake[0][1] in [0, sw] or  # Hits the screen border
            snake[0] in snake[1:]):  # Hits itself
        curses.endwin()
        quit()

    # Calculate the new head of the snake based on the current direction
    new_head = [snake[0][0], snake[0][1]]

    if key == curses.KEY_RIGHT:
        new_head[1] += 1
    elif key == curses.KEY_LEFT:
        new_head[1] -= 1
    elif key == curses.KEY_UP:
        new_head[0] -= 1
    elif key == curses.KEY_DOWN:
        new_head[0] += 1

    # Insert the new head at the beginning of the snake list
    snake.insert(0, new_head)

    # If the snake eats the food, increase the score and generate new food
    if snake[0] == food:
        score += 1
        food = None
        while food is None:
            new_food = [
                random.randint(1, sh - 1),
                random.randint(1, sw - 1)
            ]
            food = new_food if new_food not in snake else None
        w.addch(food[0], food[1], curses.ACS_PI)
    else:
        # If no food is eaten, remove the last segment of the snake
        tail = snake.pop()
        w.addch(tail[0], tail[1], ' ')

    # Update the snake's head position on the screen
    w.addch(snake[0][0], snake[0][1], curses.ACS_CKBOARD)

    # Display the score at the top of the screen
    w.addstr(0, 2, f"Score: {score} ")

# Exit the game
curses.endwin()
