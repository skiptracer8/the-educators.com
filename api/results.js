const axios = require('axios');

module.exports = async (req, res) => {
    // Enable CORS (optional, but helpful)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // Get environment variables set in Vercel
        const SHEET_ID = process.env.SHEET_ID;
        const API_KEY = process.env.API_KEY;
        const RANGE = 'Sheet1!A1:Z'; // adjust sheet name if needed
        
        if (!SHEET_ID || !API_KEY) {
            throw new Error('Missing environment variables');
        }
        
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await axios.get(url);
        
        // Return the exact same structure as Google Sheets API
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
    }
};
