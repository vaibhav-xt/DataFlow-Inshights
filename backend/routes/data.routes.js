const express = require('express');
const router = express.Router();
const list = require('../controllers/list.controller')
const stats = require('../controllers/stats.controller');
const barChart = require('../controllers/barChart.controller');
const pieChart = require('../controllers/pieChart.controller');
const aggregatedData = require('../controllers/aggregatedData.controller')

// routes 
router.get('/list', list);
router.get('/stats', stats)
router.get('/barChart', barChart)
router.get('/pieChart', pieChart)
router.get('/combined-data', aggregatedData)

module.exports = router;
