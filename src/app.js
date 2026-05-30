const express = require('express');
const dotenv  = require('dotenv');

dotenv.config();  // load .env file first

const app = express();

// --- Middleware ---
app.use(express.json());  // parse JSON request bodies

// --- Routes ---
// All profile routes are prefixed with /api
app.use('/api', require('./routes/profileRoutes'));

// --- Health check ---
// Simple endpoint to verify server is running
app.get('/', (req, res) => {
  res.json({
    message: 'GitHub Profile Analyzer API is running',
    version: '1.0.0',
    endpoints: {
      analyze:    'POST /api/analyze/:username',
      allProfiles:'GET  /api/profiles',
      oneProfile: 'GET  /api/profiles/:username',
      delete:     'DELETE /api/profiles/:username'
    }
  });
});

// --- 404 handler ---
// If no route matched, return a clean error
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`
  });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});