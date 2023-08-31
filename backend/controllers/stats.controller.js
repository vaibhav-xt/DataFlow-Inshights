const { Data } = require('../models/data.models');
const fetchMonth = require('./fetchMonth');

const stats = async (req, res) => {
    const month = Number(req.query.month) < 1 || Number(req.query.month) > 12 ? 1 : Number(req.query.month);

    try {
        let filteredData = {
            totalSaleAmount: 0,
            totalSoldItems: 0,
            totalNotSoldItems: 0
        }
        const data = await Data.find();
        data.forEach((item) => {
            const dateMonth = fetchMonth(item.dateOfSale)
            if (dateMonth === month) {
                if (item.sold) {
                    filteredData.totalSaleAmount += Number(item.price);
                    filteredData.totalSoldItems += 1;
                } else {
                    filteredData.totalNotSoldItems += 1;
                }
            }
        })
        res.status(200).json({ filteredData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = stats;