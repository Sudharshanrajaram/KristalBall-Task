const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { allowRoles } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, allowRoles(['Admin', 'BaseCommander']), assignmentController.assignAsset);
router.put('/:id/expended', verifyToken, allowRoles(['Admin', 'BaseCommander']), assignmentController.markAsExpended);
router.get('/', verifyToken, assignmentController.getAssignments);

module.exports = router;
