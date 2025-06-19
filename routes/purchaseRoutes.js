const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin', 'LogisticsOfficer']), purchaseController.recordPurchase);
router.get('/', verifyToken, allowRoles(['Admin', 'LogisticsOfficer', 'FinanceOfficer']), purchaseController.getPurchases);

module.exports = router;
