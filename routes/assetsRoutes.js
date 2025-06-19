const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin', 'LogisticsOfficer']), assetController.addAsset);
router.get('/', verifyToken, assetController.getAssets);
router.put('/:id', verifyToken, allowRoles(['Admin', 'LogisticsOfficer']), assetController.updateAsset);
router.put('/:id/status', verifyToken, allowRoles(['Admin', 'BaseCommander']), assetController.updateAssetStatus);
router.delete('/:id', verifyToken, allowRoles(['Admin', 'LogisticsOfficer']), assetController.deleteAsset);

module.exports = router;
