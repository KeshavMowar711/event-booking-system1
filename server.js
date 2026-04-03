require('dotenv').config(); // Load once at the very top
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Log to verify variables are alive


const eventRoutes = require('./src/routes/eventRoutes');
app.use('/api', eventRoutes);

// --- ADD THIS: The Debugger ---
app.use((req, res, next) => {
    console.log(`🔍 Request received: ${req.method} ${req.url}`);
    next();
});

// --- ADD THIS: Global Error Handler ---
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});