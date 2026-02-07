document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const connectionStatus = document.getElementById('connection-status');

    // Simple status check simulation (in real app, ping an endpoint)
    setTimeout(() => {
        connectionStatus.textContent = "Online";
        connectionStatus.style.color = "#2ecc71";
    }, 1000);

    // Auto-resize textarea
    userInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim().length > 0) {
            sendBtn.disabled = false;
        } else {
            sendBtn.disabled = true;
        }
    });

    // Handle Enter key
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    sendBtn.addEventListener('click', handleSend);

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // Reset input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;

        // Add User Message
        appendMessage('user', text);

        // Add Loading Message
        const loadingId = appendMessage('ai', '<div class="loading-dots"><span></span><span></span><span></span></div>', true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text })
            });

            const data = await response.json();

            // Remove loading message
            const loadingNode = document.getElementById(loadingId);
            if (loadingNode) loadingNode.remove();

            if (data.error) {
                appendMessage('ai', `**Error**: ${data.error}\n\n*Details*: ${data.details || ''}`);
            } else {
                appendMessage('ai', data.response);
            }

        } catch (error) {
            document.getElementById(loadingId)?.remove();
            appendMessage('ai', `**System Error**: Failed to reach the server. Is it running?`);
            console.error(error);
        }
    }

    function appendMessage(sender, content, isLoading = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

        // Generate ID for loading state removal
        const msgId = 'msg-' + Date.now();
        msgDiv.id = msgId;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        if (isLoading) {
            contentDiv.innerHTML = content;
        } else if (sender === 'ai') {
            // Parse Markdown
            contentDiv.innerHTML = marked.parse(content);
        } else {
            contentDiv.textContent = content;
        }

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(contentDiv);

        chatHistory.appendChild(msgDiv);

        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;

        return msgId;
    }
});
