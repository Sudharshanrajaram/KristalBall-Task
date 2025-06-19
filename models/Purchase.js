const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  quantity: Number,
  costPerUnit: Number,
  totalCost: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
