import sys
import datetime

def get_chatbot_response(user_input):
    """
    Returns the chatbot's response based on rule-matching (if-elif-else).
    Preprocesses the input by converting to lowercase and stripping whitespace.
    """
    # Normalize input for robust matching
    cleaned_input = user_input.strip().lower()
    
    # 1. Greetings
    if cleaned_input in ["hello", "hi", "hey", "greetings", "yo"]:
        return "Hi there! How can I help you today? 😊"
    
    # 2. Well-being
    elif cleaned_input in ["how are you", "how are you?", "how is it going", "how's it going"]:
        return "I'm doing great, thank you for asking! How can I assist you?"
    
    # 3. Identity / Purpose
    elif cleaned_input in ["what is your name", "what's your name", "who are you"]:
        return "I am a simple rule-based chatbot built using Python! You can call me Orbit. 🤖"
    
    # 4. Capability
    elif cleaned_input in ["what can you do", "what can you do?", "help"]:
        return (
            "I can respond to basic phrases! Try saying:\n"
            " - 'hello'\n"
            " - 'how are you'\n"
            " - 'what is your name'\n"
            " - 'time'\n"
            " - 'bye'"
        )
    
    # 5. Time check
    elif cleaned_input in ["time", "what time is it", "what time is it?"]:
        current_time = datetime.datetime.now().strftime("%I:%M %p")
        return f"The current time is {current_time}. 🕒"
    
    # 6. Farewell
    elif cleaned_input in ["bye", "goodbye", "exit", "quit"]:
        return "Goodbye! Have a wonderful day! 👋"
    
    # 7. Fallback / Default reply
    else:
        return "I'm sorry, I don't quite understand that. Could you try phrasing it differently? Type 'help' to see what I can do!"

def main():
    print("=========================================")
    print("     Welcome to the Rule-Based Chatbot!  ")
    print("=========================================")
    print("Type 'bye', 'exit', or 'quit' to end the chat.")
    print("Type 'help' to see what questions I can answer.\n")
    
    # Conversation loop
    while True:
        try:
            # Input from user
            user_input = input("You: ")
            
            # Check for empty input
            if not user_input.strip():
                continue
                
            # Get response
            response = get_chatbot_response(user_input)
            
            # Output response to user
            print(f"Chatbot: {response}\n")
            
            # Break loop if user said goodbye
            if user_input.strip().lower() in ["bye", "goodbye", "exit", "quit"]:
                break
                
        except (KeyboardInterrupt, EOFError):
            print("\nChatbot: Goodbye! 👋")
            break

if __name__ == "__main__":
    main()
