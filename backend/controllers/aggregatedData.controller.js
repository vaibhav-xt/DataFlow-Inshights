const aggregatedData = async (req, res) => {
    const month = Number(req.query.month) || 1;
    try {
        const apiUrls = [
            `http://localhost:5000/api/data/stats`,
            `http://localhost:5000/api/data/barChart?month=${month}`,
            `http://localhost:5000/api/data/pieChart?month=${month}`
        ];

        const fetchedData = await Promise.all(apiUrls.map(url => fetch(url).then(response => response.json())));

        const combinedData = {
            ...fetchedData[0],
            ...fetchedData[1],
            ...fetchedData[2]
        };

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(400).json({ mesage: error.message });
    }
}

module.exports = aggregatedData;