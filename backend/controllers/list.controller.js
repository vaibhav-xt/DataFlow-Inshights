const { Data } = require('../models/data.models');
const fetchMonth = require('./fetchMonth');

const list = async (req, res) => {
    const month = Number(req.query.month) < 1 || Number(req.query.month) > 12 ? null : Number(req.query.month);
    const page = Number(req.query.page) || 1;
    const maxResult = Number(req.query.maxResult) || 10;
    const skip = (page - 1) * maxResult;
    const search = req.query.search;

    const searchQuery = search
        ? {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { price: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ],
        }
        : {};

    try {
        const allData = await Data.find(searchQuery).skip(skip).limit(maxResult);

        let transactions = [];
        if (month) {
            transactions = allData.filter((item) => {
                const dateMonth = fetchMonth(item.dateOfSale);
                return dateMonth === month;
            });

            // Update totalItems and totalPages based on filtered transactions
            const totalItems = transactions.length;
            const totalPages = Math.ceil(totalItems / maxResult);

            res.status(200).json({
                pageInfo: {
                    page,
                    maxResult,
                    totalItems,
                    totalPages,
                },
                transactions
            });
        } else {
            transactions = [...allData];

            // Use the original totalItems for totalPages calculation
            const totalItems = await Data.countDocuments(searchQuery);
            const totalPages = Math.ceil(totalItems / maxResult);

            res.status(200).json({
                pageInfo: {
                    page,
                    maxResult,
                    totalItems,
                    totalPages,
                },
                transactions
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }


};

module.exports = list;
