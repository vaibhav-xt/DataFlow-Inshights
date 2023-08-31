const mongoose = require('mongoose');

const { Schema } = mongoose;

const dataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    dateOfSale: {
        type: String,
        required: true
    },
});

const Data = mongoose.model('Data', dataSchema);

const fetchAndSaveData = async () => {
    try {
        const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const dataJSON = await response.json();

        for (const item of dataJSON) {
            const dataInstance = new Data({
                title: item.title,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
                sold: item.sold,
                dateOfSale: item.dateOfSale
            });
            await dataInstance.save();
        }

        console.log('Data fetched and saved successfully.');
    } catch (error) {
        console.error('Error fetching and saving data:', error);
    }
};

module.exports = { Data, fetchAndSaveData };