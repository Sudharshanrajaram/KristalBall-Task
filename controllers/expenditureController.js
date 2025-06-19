const mongoose = require('mongoose');
const Expenditure = require('../models/Expenditure');
const Asset = require('../models/Assets');

exports.recordExpenditure = async (req, res) => {
  try {
    let { assetId, baseId, quantity, expendType, expendReason } = req.body;
    const userId = req.user.id;

    if (!assetId || !baseId || !quantity || !expendType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(assetId) || !mongoose.Types.ObjectId.isValid(baseId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    quantity = Number(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (asset.baseId.toString() !== baseId) {
      return res.status(400).json({ message: 'Asset does not belong to specified base' });
    }

    const expenditure = new Expenditure({
      assetId,
      baseId,
      quantity,
      expendType,
      expendReason,
      recordedBy: userId,
      date: new Date()
    });

    await expenditure.save();
    res.status(201).json({ message: 'Expenditure recorded successfully', expenditure });
  } catch (err) {
    console.error('Expenditure Save Error:', err);
    res.status(500).json({ message: 'Failed to record expenditure', error: err.message });
  }
};

exports.getExpenditures = async (req, res) => {
  try {
    const { baseId, assetId } = req.query;
    const filter = {};

    if (baseId && mongoose.Types.ObjectId.isValid(baseId)) filter.baseId = baseId;
    if (assetId && mongoose.Types.ObjectId.isValid(assetId)) filter.assetId = assetId;

    const expenditures = await Expenditure.find(filter)
      .populate('assetId', 'name type')
      .populate('baseId', 'name')
      .populate('recordedBy', 'name email')
      .sort({ date: -1 });

    res.json(expenditures);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch expenditures', error: err.message });
  }
};
