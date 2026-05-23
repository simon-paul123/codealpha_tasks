import random

# Predefined list of 5 words as specified in the game scope
WORDS = ["python", "hangman", "developer", "computer", "science"]

# Visual ASCII art stages for the hangman
HANGMAN_STAGES = [
    # 0 incorrect guesses
    """
      +---+
      |   |
          |
          |
          |
          |
    =========
    """,
    # 1 incorrect guess
    """
      +---+
      |   |
      O   |
          |
          |
          |
    =========
    """,
    # 2 incorrect guesses
    """
      +---+
      |   |
      O   |
      |   |
          |
          |
    =========
    """,
    # 3 incorrect guesses
    """
      +---+
      |   |
      O   |
     /|   |
          |
          |
    =========
    """,
    # 4 incorrect guesses
    """
      +---+
      |   |
      O   |
     /|\\  |
          |
          |
    =========
    """,
    # 5 incorrect guesses
    """
      +---+
      |   |
      O   |
     /|\\  |
     /    |
          |
    =========
    """,
    # 6 incorrect guesses
    """
      +---+
      |   |
      O   |
     /|\\  |
     / \\  |
          |
    =========
    """
]

def print_welcome():
    """Prints a friendly welcome message for the game."""
    print("=" * 50)
    print("           WELCOME TO HANGMAN GAME!           ")
    print("=" * 50)
    print("Rules:")
    print("- A secret word will be chosen randomly.")
    print("- Guess one letter at a time.")
    print("- You are allowed a maximum of 6 incorrect guesses.")
    print("- Good luck!")
    print("=" * 50)

def display_word_status(word, guessed_letters):
    """Displays the hidden word with guessed letters revealed and others as underscores."""
    display = []
    for letter in word:
        if letter in guessed_letters:
            display.append(letter)
        else:
            display.append("_")
    return " ".join(display)

def play_hangman():
    """Runs a single session of the Hangman game."""
    # Select a random word
    secret_word = random.choice(WORDS)
    guessed_letters = set()
    incorrect_guesses = 0
    max_incorrect = 6

    print("\nStarting a new game...")

    while incorrect_guesses < max_incorrect:
        # Display hangman stage
        print(HANGMAN_STAGES[incorrect_guesses])
        
        # Display current word status
        word_status = display_word_status(secret_word, guessed_letters)
        print(f"Word to guess: {word_status}")
        print(f"Incorrect guesses remaining: {max_incorrect - incorrect_guesses}")
        
        # Display previously guessed letters if any
        if guessed_letters:
            sorted_guesses = sorted(list(guessed_letters))
            print(f"Guessed letters: {', '.join(sorted_guesses)}")
        
        # Get player's input
        guess = input("Guess a letter: ").strip().lower()
        print("-" * 50)

        # Validate input
        if len(guess) != 1 or not guess.isalpha():
            print("Invalid input! Please enter a single alphabetical letter.")
            continue
        
        if guess in guessed_letters:
            print(f"You already guessed '{guess}'. Try a different letter.")
            continue
        
        # Add guess to the list of guessed letters
        guessed_letters.add(guess)

        # Check if the guess is in the secret word
        if guess in secret_word:
            print(f"Good job! '{guess}' is in the word.")
            # Check if player has guessed all letters
            if all(letter in guessed_letters for letter in secret_word):
                print(HANGMAN_STAGES[incorrect_guesses])
                print(f"Congratulations! You guessed the word: {secret_word.upper()} 🎉")
                print("You won!")
                return True
        else:
            incorrect_guesses += 1
            print(f"Sorry, '{guess}' is not in the word.")
            
    # If incorrect guesses reach the limit
    print(HANGMAN_STAGES[max_incorrect])
    print(f"Game Over! You've run out of guesses. 💀")
    print(f"The secret word was: {secret_word.upper()}")
    return False

def main():
    print_welcome()
    while True:
        play_hangman()
        print("=" * 50)
        play_again = input("Do you want to play again? (y/n): ").strip().lower()
        if play_again not in ('y', 'yes'):
            print("\nThank you for playing Hangman! Goodbye!")
            break
        print("=" * 50)

if __name__ == "__main__":
    main()
