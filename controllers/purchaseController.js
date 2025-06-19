const Asset = require('../models/Assets');
const Purchase = require('../models/Purchase');

exports.recordPurchase = async (req, res) => {
  try {
    const { isNewAsset, name, type, assetId, quantity, costPerUnit, baseId } = req.body;

    const qty = parseInt(quantity);
    const cost = parseFloat(costPerUnit);
    const totalCost = qty * cost;
    const date = new Date();

    let asset;

    if (isNewAsset) {
      asset = new Asset({
        name,
        type,
        baseId,
        quantity: qty,
        openingBalance: totalCost,
        closingBalance: totalCost
      });
      await asset.save();
    } else {
      asset = await Asset.findById(assetId);
      if (!asset) return res.status(404).json({ message: 'Asset not found' });

      asset.quantity += qty;
      asset.closingBalance += totalCost;

      if (asset.openingBalance === 0) {
        asset.openingBalance = asset.closingBalance;
      }

      await asset.save();
    }

    const purchase = new Purchase({
      assetId: asset._id,
      baseId,
      quantity: qty,
      costPerUnit: cost,
      totalCost,
      date
    });

    await purchase.save();

    const populatedPurchase = await Purchase.findById(purchase._id)
      .populate('assetId', 'name type')
      .populate('baseId', 'name');

    res.status(201).json({ message: 'Purchase recorded successfully', purchase: populatedPurchase });
  } catch (err) {
    res.status(500).json({ error: 'Purchase failed', details: err.message });
  }
};


exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('baseId', 'name')
      .populate('assetId', 'name type');
    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchases', details: err.message });
  }
};
