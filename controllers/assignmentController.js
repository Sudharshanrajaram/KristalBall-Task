const Assignment = require('../models/Assignment');
const Asset = require('../models/Assets');

exports.assignAsset = async (req, res) => {
  try {
    const { assetId, assignedTo } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset || asset.status !== 'Available') {
      return res.status(400).json({ message: 'Asset not available or not found' });
    }

    const assignment = new Assignment({
      assetId,
      assignedTo,
      assignedBy: req.user.id,
      status: 'Assigned'
    });

    await assignment.save();
    asset.status = 'Assigned';
    await asset.save();

    res.status(201).json({ message: 'Asset assigned successfully', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Assignment failed', error: err.message });
  }
};

exports.markAsExpended = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment || assignment.status !== 'Assigned') {
      return res.status(404).json({ message: 'Assignment not found or already expended' });
    }

    assignment.status = 'Expended';
    assignment.expendedAt = new Date();
    await assignment.save();

    await Asset.findByIdAndUpdate(assignment.assetId, { status: 'Expended' });

    res.json({ message: 'Asset marked as expended', assignment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as expended', error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { status, assetId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (assetId) filter.assetId = assetId;

    const assignments = await Assignment.find(filter).populate('assetId assignedBy');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: err.message });
  }
};
