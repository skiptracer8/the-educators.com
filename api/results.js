const axios = require('axios');

module.exports = async (req, res) => {
    // CORS headers (allow all for debugging)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const SHEET_ID = process.env.SHEET_ID;
        const API_KEY = process.env.API_KEY;
        const RANGE = 'Sheet1!A1:Z'; // change if your sheet has a different name

        if (!SHEET_ID || !API_KEY) {
            throw new Error('Environment variables SHEET_ID and/or API_KEY are missing');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await axios.get(url);

        // Return the exact structure that Google Sheets API returns
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        // Send a structured error to the frontend
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            details: error.message,
            // Include stack only during development (optional)
            stack: error.stack
        });
    }
};
