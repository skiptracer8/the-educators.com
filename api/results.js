const axios = require('axios');

module.exports = async (req, res) => {
    // Allow CORS (for development, allow all origins; restrict later if needed)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const SHEET_ID = process.env.SHEET_ID;
        const API_KEY = process.env.API_KEY;
        const RANGE = 'Sheet1!A1:Z'; // <-- change if your sheet is named differently

        if (!SHEET_ID || !API_KEY) {
            throw new Error('Missing environment variables');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await axios.get(url);
        
        // Return the data exactly as Google Sheets API returns it
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error in proxy:', error.message);
        // Send a detailed error message (for debugging)
        res.status(500).json({ 
            error: 'Failed to fetch data from Google Sheets',
            details: error.message 
        });
    }
};
