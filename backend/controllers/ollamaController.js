const CONFIG = require('../config');

// Helper to handle the Ollama API call with Streaming
const generateTestCases = async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    console.log(`[🚀 Generating STREAM] Prompt: "${input.substring(0, 50)}..."`);

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const controller = new AbortController();
    // Increase timeout for streaming too, though chunks keep it alive
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    try {
        const response = await fetch(CONFIG.OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                prompt: input,
                system: CONFIG.SYSTEM_PROMPT,
                stream: true // Enable streaming from Ollama
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = ''; // Buffer for fragmented JSON lines

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');

            // Re-buffer the last incomplete line
            buffer = lines.pop();

            for (const line of lines) {
                if (line.trim() === '') continue;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        res.write(json.response);
                    }
                } catch (e) {
                    console.error('⚠️ JSON Parse Error on fragment:', line);
                }
            }
        }

        res.end();

    } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Stream Error:', error.message);

        // If headers haven't been sent, send JSON error. 
        // If streaming started, we can't send JSON anymore, just end the stream.
        if (!res.headersSent) {
            res.status(500).json({ error: 'Generation Failed', details: error.message });
        } else {
            res.end();
        }
    }
};

module.exports = { generateTestCases };
