const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'llama3.2';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// System Prompt / Template
const SYSTEM_PROMPT = `You are an expert QA Engineer. Your task is to generate detailed test cases based on the user's input.
You must STRICTLY follow this format for every test case:

**Test Case ID**: [TC_XXX]
**Title**: [Short descriptive title]
**Description**: [Brief description of what is being tested]
**Preconditions**:
- [Condition 1]
- [Condition 2]
**Steps**:
1. [Step 1]
2. [Step 2]
**Expected Result**: [What should happen]

Focus on edge cases, positive flows, and negative flows.
Return the output in Markdown format.
`;

// Routes
app.post('/api/generate', async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({ error: 'Input is required' });
    }

    console.log(`[Generating] Input: "${input.substring(0, 50)}..."`);

    try {
        // Using native fetch (Node 18+)
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                prompt: input,
                system: SYSTEM_PROMPT,
                stream: false // For simplicity in v1, we'll wait for full response. Upgrade to streams later if needed.
            }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Model '${MODEL}' not found. Please run 'ollama pull ${MODEL}' to install it.`);
            }
            throw new Error(`Ollama API Error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ response: data.response });

    } catch (error) {
        console.error('Error connecting to Ollama:', error);
        res.status(500).json({
            error: 'Failed to generate test cases. Ensure Ollama is running and llama3.2 is pulled.',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Make sure Ollama is running: 'ollama serve'`);
});
