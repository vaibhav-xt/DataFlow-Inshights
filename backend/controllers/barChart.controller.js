const { Data } = require('../models/data.models');
const fetchMonth = require('./fetchMonth')

const barChart = async (req, res) => {
    const month = Number(req.query.month) < 1 || Number(req.query.month) > 12 ? 1 : Number(req.query.month);

    try {
        const data = await Data.find();
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        const priceRangeCounts = Array(priceRanges.length).fill(0);

        data.forEach((item) => {
            const dateMonth = fetchMonth(item.dateOfSale)

            if (dateMonth === month) {
                const itemPrice = parseFloat(item.price);
                for (let i = 0; i < priceRanges.length; i++) {
                    if (itemPrice >= priceRanges[i].min && itemPrice <= priceRanges[i].max) {
                        priceRangeCounts[i]++;
                        break;
                    }
                }
            }
        });

        const response = priceRanges.map((range, index) => {
            return {
                range: `${range.min} - ${range.max}`,
                itemCount: priceRangeCounts[index]
            };
        });

        res.status(200).json({ barChartData: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = barChart;