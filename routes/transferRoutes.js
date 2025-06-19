const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin', 'LogisticsOfficer']), transferController.createTransfer);
router.get('/', verifyToken, transferController.getTransfers);

module.exports = router;
