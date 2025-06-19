const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin', 'BaseCommander']), expenditureController.recordExpenditure);
router.get('/', verifyToken, allowRoles(['Admin', 'BaseCommander']), expenditureController.getExpenditures);

module.exports = router;
