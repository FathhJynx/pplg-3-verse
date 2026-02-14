
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Input Request: ${req.method} ${req.url}`);
    console.log(`Path: ${req.path}`);
    console.log(`OriginalUrl: ${req.originalUrl}`);
    next();
});

// Routes
const studentRoutes = require('../backend/src/routes/studentRoutes');
const chatRoutes = require('../backend/src/routes/chatRoutes');
const galleryRoutes = require('../backend/src/routes/galleryRoutes');

// Mount routes
// Note: Netlify functions usually run on /.netlify/functions/api
// We can use a router to handle the /api prefix or mount directly if redirects strip it.
// Given netlify.toml redirects /api/* to this function, the event path will likely include /api/

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to PPLG 3 Nexus API' });
});

router.use('/students', studentRoutes);
router.use('/chat', chatRoutes);
router.use('/gallery', galleryRoutes);

// Mount the router at /api or / (depending on how serverless-http handles the incoming path)
// If we use `app.use('/.netlify/functions/api', router)` it matches the full path.
// Or we can just use `app.use('/api', router)` provided the redirect preserves the path.
// Mount the router at the Netlify function path
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
