const mongoose = require('mongoose');
const Asset = require('../models/Assets');
const Base = require('../models/Base');

exports.addAsset = async (req, res) => {
  try {
    const { name, type, baseId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(baseId)) {
      return res.status(400).json({ message: 'Invalid baseId format' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const baseExists = await Base.findById(baseId);
    if (!baseExists) {
      return res.status(404).json({ message: 'Base not found' });
    }

    const asset = new Asset({ name, type, baseId, quantity });
    await asset.save();

    res.status(201).json({ message: 'Asset added to base', asset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add asset', error: err.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const { baseId, type, status } = req.query;
    const filter = {};

    if (baseId && mongoose.Types.ObjectId.isValid(baseId)) {
      filter.baseId = baseId;
    } else if (baseId) {
      return res.status(400).json({ message: 'Invalid baseId format' });
    }

    if (type) filter.type = type;
    if (status) filter.status = status;

    const assets = await Asset.find(filter).populate('baseId');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch assets', error: err.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, baseId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid asset ID' });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (type) updateFields.type = type;

    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity cannot be negative' });
      }
      updateFields.quantity = quantity;
    }

    if (baseId) {
      if (!mongoose.Types.ObjectId.isValid(baseId)) {
        return res.status(400).json({ message: 'Invalid baseId format' });
      }

      const baseExists = await Base.findById(baseId);
      if (!baseExists) {
        return res.status(404).json({ message: 'Base not found' });
      }

      updateFields.baseId = baseId;
    }

    const updatedAsset = await Asset.findByIdAndUpdate(id, updateFields, { new: true }).populate('baseId');
    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ message: 'Asset updated successfully', asset: updatedAsset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update asset', error: err.message });
  }
};

exports.updateAssetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Assigned', 'Expended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid asset ID' });
    }

    const updatedAsset = await Asset.findByIdAndUpdate(id, { status }, { new: true }).populate('baseId');

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ message: 'Asset status updated successfully', asset: updatedAsset });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid asset ID' });
    }

    const deletedAsset = await Asset.findByIdAndDelete(id);
    if (!deletedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete asset', error: err.message });
  }
};
