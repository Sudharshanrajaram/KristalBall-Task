// routes/dashboard.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Asset = require('../models/Assets');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Expenditure = require('../models/Expenditure');
const Base = require('../models/Base');

router.get('/', async (req, res) => {
  try {
    const { date, equipmentType } = req.query;

    // Build asset filter if equipmentType is provided
    let assetFilter = {};
    if (equipmentType) {
      const matched = await Asset.find({ name: equipmentType });
      const assetIds = matched.map(a => a._id);
      if (!assetIds.length) {
        // If no matching, return zeroed metrics
        return res.json({
          totalAssets: 0,
          totalBases: 0,
          totalAssetQuantity: 0,
          totalTransfers: 0,
          totalPurchases: 0,
          totalExpenditures: 0,
          totalTransferIn: 0,
          totalTransferOut: 0,
          netMovement: 0,
          netMovementCost: 0,
          recentTransfers: [],
          recentExpenditures: [],
          baseBalances: []
        });
      }
      assetFilter = { assetId: { $in: assetIds } };
    }

    const dateFilter = {};
    let startDate, endDate;
    if (date) {
      startDate = new Date(date);
      endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      dateFilter.date = { $gte: startDate, $lt: endDate };
    }

    // Counts and quantities
    const totalAssets = await Asset.countDocuments();
    const totalBases = await Base.countDocuments();
    const totalQuantityAcrossAssets = await Asset.aggregate([
      { $group: { _id: null, total: { $sum: '$quantity' } } }
    ]);

    // For each base, compute opening/cl so cost balances
    const allBases = await Base.find();
    const baseBalances = [];

    for (const base of allBases) {
      const baseId = base._id;

      const [
        purchBf, expBf, purchUntil, expUntil
      ] = await Promise.all([
        Purchase.aggregate([
          { $match: { date: { $lt: startDate }, baseId, ...assetFilter } },
          { $group: { _id: null, totalCost: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } } } }
        ]),
        Expenditure.aggregate([
          { $match: { date: { $lt: startDate }, baseId, ...assetFilter } },
          { $group: { _id: null, totalCost: { $sum: '$cost' } } }
        ]),
        Purchase.aggregate([
          { $match: { date: { $lt: endDate }, baseId, ...assetFilter } },
          { $group: { _id: null, totalCost: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } } } }
        ]),
        Expenditure.aggregate([
          { $match: { date: { $lt: endDate }, baseId, ...assetFilter } },
          { $group: { _id: null, totalCost: { $sum: '$cost' } } }
        ])
      ]);

      const openingBalance = (purchBf[0]?.totalCost || 0) - (expBf[0]?.totalCost || 0);
      const closingBalance = (purchUntil[0]?.totalCost || 0) - (expUntil[0]?.totalCost || 0);

      baseBalances.push({
        baseId,
        baseName: base.name,
        openingBalance,
        closingBalance
      });
    }

    // Fetch all filtered transactions
    const [purchases, transfers, expenditures] = await Promise.all([
      Purchase.find({ ...dateFilter, ...assetFilter }).populate('assetId'),
      Transfer.find({ ...dateFilter, ...(equipmentType ? assetFilter : {}) }).populate('assetId toBaseId fromBaseId'),
      Expenditure.find({ ...dateFilter, ...(equipmentType ? assetFilter : {}) }).populate('assetId baseId')
    ]);

    const totalTransfers = transfers.length;
    const totalPurchases = purchases.length;
    const totalExpenditures = expenditures.length;

    const totalTransferIn = transfers.reduce((s, t) => s + t.quantity, 0);
    const totalTransferOut = transfers.reduce((s, t) => s + t.quantity, 0);
    const netMovement = totalPurchases + totalTransferIn - totalTransferOut;

    const recentTransfers = transfers
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
    const recentExpenditures = expenditures
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    const netMovementCost = baseBalances.reduce(
      (acc, d) => acc + (d.closingBalance - d.openingBalance),
      0
    );

    res.json({
      totalAssets,
      totalBases,
      totalAssetQuantity: totalQuantityAcrossAssets[0]?.total || 0,
      totalTransfers,
      totalPurchases,
      totalExpenditures,
      totalTransferIn,
      totalTransferOut,
      netMovement,
      netMovementCost,
      recentTransfers,
      recentExpenditures,
      baseBalances
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Failed loading dashboard', error: err.message });
  }
});

module.exports = router;
