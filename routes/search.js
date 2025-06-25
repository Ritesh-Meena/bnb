const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');   

// Search route to handle the query
router.get('/search', async (req, res) => {
    const query = req.query.query;  // Get the search query from the URL
    
    if (!query) {
        return res.redirect('/listings');  // Redirect if no query is provided
    }

    try {
        // Search listings based on the location or country fields
        const searchResults = await Listing.find({
            $or: [
                { location: { $regex: query, $options: 'i' } },
                { country: { $regex: query, $options: 'i' } }
            ]
        });

        // Render search results page
        res.render('search-results', { listings: searchResults });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while searching');
    }
});

module.exports = router;
