module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const SHEET_ID = process.env.SHEET_ID;
        const API_KEY  = process.env.API_KEY;
        const RANGE    = 'Sheet1!A1:Z1000'; // fixed: Google Sheets needs explicit end row

        if (!SHEET_ID || !API_KEY) {
            throw new Error('Environment variables SHEET_ID and/or API_KEY are missing');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;

        // Use native fetch (Node 18+ / Vercel default runtime)
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Google Sheets API error ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({
            error: 'Failed to fetch data from Google Sheets',
            details: error.message
        });
    }
};
