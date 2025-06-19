const mongoose = require('mongoose');
const Asset = require('../models/Assets');
const Transfer = require('../models/Transfer');

exports.createTransfer = async (req, res) => {
  try {
    let { assetId, fromBaseId, toBaseId, quantity } = req.body;
    quantity = parseInt(quantity, 10);
    if (
      !mongoose.Types.ObjectId.isValid(assetId) ||
      !mongoose.Types.ObjectId.isValid(fromBaseId) ||
      !mongoose.Types.ObjectId.isValid(toBaseId)
    ) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    if (!asset.baseId || asset.baseId.toString() !== fromBaseId) {
      return res.status(400).json({ message: 'Asset is not at the specified fromBase' });
    }

    if (asset.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough asset quantity at source base' });
    }

    const fromAssetQuantityBefore = asset.quantity;
    asset.quantity -= quantity;
    const fromAssetQuantityAfter = asset.quantity;

    if (asset.quantity === 0) {
      await asset.deleteOne();
    } else {
      await asset.save();
    }

    let toAsset = await Asset.findOne({
      name: asset.name,
      type: asset.type,
      baseId: toBaseId
    });

    const toAssetQuantityBefore = toAsset ? toAsset.quantity : 0;

    if (toAsset) {
      toAsset.quantity += quantity;
      await toAsset.save();
    } else {
      toAsset = new Asset({
        name: asset.name,
        type: asset.type,
        baseId: toBaseId,
        quantity,
        status: 'Available'
      });
      await toAsset.save();
    }

    const toAssetQuantityAfter = toAsset.quantity;

    const transfer = new Transfer({
      assetId: asset._id,
      fromBaseId,
      toBaseId,
      quantity,
      transferredBy: req.user.id,
      fromAssetQuantityBefore,
      fromAssetQuantityAfter,
      toAssetQuantityBefore,
      toAssetQuantityAfter,
      date: new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    });

    await transfer.save();

    res.status(201).json({ message: 'Asset quantity transferred successfully', transfer });
  } catch (err) {
    res.status(500).json({ message: 'Failed to transfer asset', error: err.message });
  }
};

exports.getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate('assetId')
      .populate('fromBaseId')
      .populate('toBaseId')
      .populate('transferredBy')
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transfers', error: err.message });
  }
};
