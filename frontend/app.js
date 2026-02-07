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

    let isGenerating = false;

    // 3. Generation Logic (Streaming)
    async function handleGeneration() {
        const text = featureInput.value.trim();
        if (!text || isGenerating) return;

        isGenerating = true;

        // UI Updates
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating...`;
        welcomeState.classList.add('hidden');

        // CLEAR PREVIOUS ERROR CARDS to keep UI clean
        const existingErrors = document.querySelectorAll('.error-card');
        existingErrors.forEach(err => err.remove());

        // Create a result card immediately for streaming
        const resultId = createResultCard(text, "");
        const resultContentDiv = document.getElementById(resultId).querySelector('.result-content');

        // Thinking placeholder
        resultContentDiv.innerHTML = '<p class="thinking-text" style="color: var(--text-secondary); opacity: 0.7;"><i class="fa-solid fa-ellipsis fa-fade"></i> AI is brainstorming...</p>';

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: text })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let lastRenderTime = 0;
            const RENDER_INTERVAL = 40; // Balanced rendering

            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    resultContentDiv.innerHTML = marked.parse(accumulatedText);
                    break;
                }

                if (firstChunk) {
                    resultContentDiv.innerHTML = "";
                    firstChunk = false;
                }

                const chunk = decoder.decode(value, { stream: true });
                accumulatedText += chunk;

                const now = Date.now();
                if (now - lastRenderTime > RENDER_INTERVAL) {
                    resultContentDiv.innerHTML = marked.parse(accumulatedText);
                    lastRenderTime = now;

                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }

            featureInput.value = '';
            featureInput.style.height = 'auto';

        } catch (error) {
            console.error('Frontend Error:', error);
            // Show inline error instead of removing the card
            const errorDiv = document.createElement('div');
            errorDiv.style.borderTop = '1px solid #ef4444';
            errorDiv.style.marginTop = '1rem';
            errorDiv.style.paddingTop = '1rem';
            errorDiv.innerHTML = `<span style="color: #ef4444; font-size: 0.9rem;"><i class="fa-solid fa-triangle-exclamation"></i> <strong>Stream Interrupted</strong>: ${error.message}</span>`;
            resultContentDiv.appendChild(errorDiv);
        } finally {
            isGenerating = false;
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
