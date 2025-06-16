const express = require('express');
const cors = require('cors');
const { scrapeNews } = require('./scraper'); // Adjust path as needed

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for news scraping
app.get('/api/news', async (req, res) => {
    try {
        const { url, keyword = '', sortBy = 'default' } = req.query;
        
        console.log('Scraping request:', { url, keyword, sortBy });
        
        // Call the scraper with the provided URL (or empty string for default sites)
        const articles = await scrapeNews(url || '', keyword, sortBy);
        
        res.json(articles);
    } catch (error) {
        console.error('Error in /api/news:', error);
        res.status(500).json({ 
            error: 'Failed to scrape news',
            message: error.message,
            articles: []
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;