// Nova AI - Chatbot Client Logic

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-form");
    const userInput = document.getElementById("user-input");
    const resetBtn = document.getElementById("reset-chat");
    const themeBtn = document.getElementById("toggle-theme");
    const quickReplies = document.getElementById("quick-replies");
    const toast = document.getElementById("toast");

    // Predefined bot states
    let isTyping = false;

    // Theme state
    let currentTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon();

    // 1. Initialize Bot
    sendBotMessage("Hi there! I am Orbit, a rule-based AI assistant. How can I help you today? 😊");

    // 2. Chat Form Submission
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text || isTyping) return;

        handleUserMessage(text);
        userInput.value = "";
    });

    // 3. Quick Reply Chip Clicks
    quickReplies.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip || isTyping) return;

        const phrase = chip.getAttribute("data-phrase");
        handleUserMessage(phrase);
    });

    // 4. Reset Conversation
    resetBtn.addEventListener("click", () => {
        chatMessages.innerHTML = "";
        sendBotMessage("Chat history reset. How can I assist you now? 🤖");
        showToast("Conversation reset successfully!");
    });

    // 5. Toggle Theme (Light/Dark)
    themeBtn.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", currentTheme);
        localStorage.setItem("theme", currentTheme);
        updateThemeIcon();
        showToast(`Theme switched to ${currentTheme} mode`);
    });

    // --- Helper Functions ---

    function handleUserMessage(message) {
        // Render User bubble
        renderMessage(message, "user");

        // Show typing indicator
        showTypingIndicator();

        // Calculate answer & delay response for premium chat feel
        const reply = getBotReply(message);

        setTimeout(() => {
            hideTypingIndicator();
            renderMessage(reply, "bot");
        }, 800);
    }

    function renderMessage(text, sender) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper", sender);

        const avatar = document.createElement("div");
        avatar.classList.add("msg-avatar");
        avatar.textContent = sender === "bot" ? "🤖" : "👤";

        const bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble-container");

        const bubble = document.createElement("div");
        bubble.classList.add("msg-bubble");
        // Convert newlines in response to HTML break tags
        bubble.innerHTML = text.replace(/\n/g, "<br>");

        const time = document.createElement("div");
        time.classList.add("msg-time");
        const now = new Date();
        time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubbleContainer.appendChild(bubble);
        bubbleContainer.appendChild(time);
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubbleContainer);

        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function sendBotMessage(text) {
        renderMessage(text, "bot");
    }

    function showTypingIndicator() {
        isTyping = true;
        
        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper", "bot", "typing-wrapper");
        wrapper.id = "typing-indicator-node";

        const avatar = document.createElement("div");
        avatar.classList.add("msg-avatar");
        avatar.textContent = "🤖";

        const bubbleContainer = document.createElement("div");
        bubbleContainer.classList.add("bubble-container");

        const bubble = document.createElement("div");
        bubble.classList.add("msg-bubble");
        
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("typing-indicator");
        typingIndicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;

        bubble.appendChild(typingIndicator);
        bubbleContainer.appendChild(bubble);
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubbleContainer);

        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        isTyping = false;
        const typingNode = document.getElementById("typing-indicator-node");
        if (typingNode) {
            typingNode.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Rule engine mimicking python's get_chatbot_response ---
    function getBotReply(input) {
        const cleaned = input.trim().toLowerCase();

        // 1. Greetings
        if (["hello", "hi", "hey", "greetings", "yo"].includes(cleaned)) {
            return "Hi there! How can I help you today? 😊";
        }
        
        // 2. Well-being
        if (["how are you", "how are you?", "how is it going", "how's it going"].includes(cleaned)) {
            return "I'm doing great, thank you for asking! How can I assist you?";
        }

        // 3. Name / Identity
        if (["what is your name", "what's your name", "who are you"].includes(cleaned)) {
            return "I am a simple rule-based chatbot built using Python! You can call me Orbit. 🤖";
        }

        // 4. Capability / Help
        if (["what can you do", "what can you do?", "help"].includes(cleaned)) {
            return "I can respond to basic phrases! Try saying:\n - 'hello'\n - 'how are you'\n - 'what is your name'\n - 'time'\n - 'bye'";
        }

        // 5. Time check
        if (["time", "what time is it", "what time is it?"].includes(cleaned)) {
            const current = new Date();
            const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `The current time is {timeStr}. 🕒`.replace("{timeStr}", timeStr);
        }

        // 6. Farewell
        if (["bye", "goodbye", "exit", "quit"].includes(cleaned)) {
            return "Goodbye! Have a wonderful day! 👋";
        }

        // 7. Fallback / Default
        return "I'm sorry, I don't quite understand that. Could you try phrasing it differently? Type 'help' to see what I can do!";
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }

    function updateThemeIcon() {
        const sunIcon = themeBtn.querySelector("svg");
        if (currentTheme === "dark") {
            sunIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        } else {
            // Moon icon for light mode
            sunIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        }
    }
});
