const express = require('express');
const cors = require('cors');
const path = require('path');
const CONFIG = require('./config');
const { generateTestCases } = require('./controllers/ollamaController');

// Global Error Handling to prevent crashes
process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the 'frontend' directory (one level up)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.post('/api/generate', generateTestCases);

// Fallback for SPA (if we expand later, keeps the app efficient)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(CONFIG.PORT, CONFIG.HOST, () => {
    console.log(`\n🚀 Gravity TestGen Server running at http://${CONFIG.HOST}:${CONFIG.PORT}`);
    console.log(`🔗 Connected to Ollama (${CONFIG.MODEL})`);
});
