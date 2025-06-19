const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin']), baseController.createBase);
router.get('/', verifyToken, baseController.getBases);

module.exports = router;
