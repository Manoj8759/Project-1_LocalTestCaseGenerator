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
            let lastRenderTime = 0;
            const RENDER_INTERVAL = 50; // Render every 50ms to save CPU

            console.log("Stream connected, receiving data...");

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // Final render to catch remaining text
                    resultContentDiv.innerHTML = marked.parse(accumulatedText);
                    console.log("Stream finished.");
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                const now = Date.now();
                if (now - lastRenderTime > RENDER_INTERVAL) {
                    resultContentDiv.innerHTML = marked.parse(accumulatedText);
                    lastRenderTime = now;

                    // Auto-scroll
                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }

            // Final consistency check
            featureInput.value = '';
            featureInput.style.height = 'auto';

        } catch (error) {
            document.getElementById(resultId)?.remove();
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

    // Helper: Create Result Card (Updated for Stream & Efficiency)
    function createResultCard(prompt, initialMarkdown) {
        const id = 'result-' + Date.now();
        const card = document.createElement('div');
        card.className = 'result-card animate-slide-up';
        card.id = id;

        const timestamp = new Date().toLocaleTimeString();

        const header = `
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem;">
                <div style="flex: 1;">
                    <span style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 2px;">Feature Brief</span>
                    <h3 style="margin: 5px 0 0 0; color: white; font-size: 1rem;">${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}</h3>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <button class="action-btn copy-btn" title="Copy Markdown" onclick="copyToClipboard('${id}')">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap;">
                        <i class="fa-regular fa-clock"></i> ${timestamp}
                    </div>
                </div>
            </div>
        `;

        card.innerHTML = header + `<div class="result-content markdown-body">${marked.parse(initialMarkdown)}</div>`;
        resultsContainer.prepend(card);
        return id;
    }

    // Copy to Clipboard Utility
    window.copyToClipboard = (cardId) => {
        const content = document.getElementById(cardId).querySelector('.result-content').innerText;
        navigator.clipboard.writeText(content).then(() => {
            const btn = document.querySelector(`#${cardId} .copy-btn`);
            const icon = btn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            btn.style.color = '#10b981';
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
                btn.style.color = '';
            }, 2000);
        });
    };

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
