const { Data } = require('../models/data.models');
const fetchMonth = require('./fetchMonth')

const pieChart = async (req, res) => {
    const month = Number(req.query.month) < 1 || Number(req.query.month) > 12 ? 1 : Number(req.query.month);

    try {
        const data = await Data.find();
        const categoryCounts = {};

        data.forEach((item) => {
            const dateMonth = fetchMonth(item.dateOfSale);
            if (dateMonth === month) {
                const category = item.category;
                if (category in categoryCounts) {
                    categoryCounts[category]++;
                } else {
                    categoryCounts[category] = 1;
                }
            }
        });

        const pieChartData = Object.keys(categoryCounts).map((category) => ({
            [category]: categoryCounts[category]
        }));

        res.status(200).json({ pieChartData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = pieChart;