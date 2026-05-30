const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/profileController');

// POST /api/analyze/:username  → analyze and store a GitHub profile
router.post('/analyze/:username', controller.analyzeProfile);

// GET /api/profiles            → get all stored profiles
router.get('/profiles',          controller.getAllProfiles);

// GET /api/profiles/:username  → get one profile with its repos
router.get('/profiles/:username', controller.getProfile);

// DELETE /api/profiles/:username → delete a stored profile
router.delete('/profiles/:username', controller.deleteProfile);

module.exports = router;