const mongoose = require('mongoose');

const ExpenditureSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  quantity: { type: Number, required: true },
  expendType: { type: String, enum: ['Used', 'Transfered', 'Expired'], default: 'Transfered' },
  expendReason: { type: String, required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expenditure', ExpenditureSchema);
