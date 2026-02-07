document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const featureInput = document.getElementById('feature-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultsContainer = document.getElementById('results-container');
    const welcomeState = document.getElementById('welcome-state');
    const ollamaStatus = document.getElementById('ollama-status');

    // 1. Connection Check (Simulated for UX, Real check could happen via another endpoint)
    setTimeout(() => {
        ollamaStatus.textContent = "Online";
        ollamaStatus.style.color = "#10b981"; // Green
        ollamaStatus.parentElement.querySelector('.status-dot').classList.remove('error');
    }, 1500);

    // 2. Input Handling
    featureInput.addEventListener('input', function () {
        // Auto-resize
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

        // Enable/Disable Button
        if (this.value.trim().length > 5) {
            generateBtn.disabled = false;
        } else {
            generateBtn.disabled = true;
        }
    });

    // Handle Enter key (Ctrl + Enter to submit)
    featureInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (!generateBtn.disabled) handleGeneration();
        }
    });

    generateBtn.addEventListener('click', handleGeneration);

    // 3. Generation Logic (Streaming)
    async function handleGeneration() {
        const text = featureInput.value.trim();
        if (!text) return;

        // UI Updates
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating...`;
        welcomeState.classList.add('hidden');

        // Create a result card immediately for streaming
        const resultId = createResultCard(text, "");
        const resultContentDiv = document.getElementById(resultId).querySelector('.result-content');

        try {
            console.log("Starting stream...");
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text })
            });

            if (!response.ok) throw new Error(response.statusText);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                // Update UI visually
                resultContentDiv.innerHTML = marked.parse(accumulatedText);

                // Keep scrolling into view if user is at bottom? 
                // resultsContainer.scrollTop = resultsContainer.scrollHeight; 
            }

            // Final consistency check
            featureInput.value = '';
            featureInput.style.height = 'auto';

        } catch (error) {
            document.getElementById(resultId)?.remove(); // Remove partial result if total fail
            createErrorCard("Network Error", "Connection lost or server error.");
            console.error(error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Generate`;
            if (featureInput.value.length < 5) generateBtn.disabled = true;
        }
    }

    // Helper: Create Loading Card (Deprecated by streaming, kept for reference or legacy)
    function createLoadingCard() {
        // ... (unused now)
        return null;
    }

    // Helper: Create Result Card (Updated for Stream)
    function createResultCard(prompt, initialMarkdown) {
        const id = 'result-' + Date.now();
        const card = document.createElement('div');
        card.className = 'result-card';
        card.id = id;

        const timestamp = new Date().toLocaleTimeString();

        const header = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                <div>
                    <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px;">Request</span>
                    <h3 style="margin: 5px 0 0 0; color: white;">${prompt.substring(0, 60)}${prompt.length > 60 ? '...' : ''}</h3>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-regular fa-clock"></i> ${timestamp}</div>
            </div>
        `;

        card.innerHTML = header + `<div class="result-content">${marked.parse(initialMarkdown)}</div>`;
        resultsContainer.prepend(card);
        return id;
    }

    // Helper: Create Error Card
    function createErrorCard(title, details) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.borderLeft = '3px solid #ef4444';

        card.innerHTML = `
            <h3 style="color: #ef4444; margin-top: 0;"><i class="fa-solid fa-triangle-exclamation"></i> ${title}</h3>
            <p>${details}</p>
        `;
        resultsContainer.prepend(card);
    }
});
