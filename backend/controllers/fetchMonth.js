const fetchMonth = (dateOfSale) => {
    const dateObj = new Date(dateOfSale);
    return dateObj.getMonth() + 1;
}

module.exports = fetchMonth;

