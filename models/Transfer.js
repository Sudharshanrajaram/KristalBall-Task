const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transferSchema = new Schema({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  fromBaseId: { type: Schema.Types.ObjectId, ref: 'Base', required: true },
  toBaseId: { type: Schema.Types.ObjectId, ref: 'Base', required: true },
  quantity: { type: Number, required: true },
  transferredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromAssetQuantityBefore: Number,
  fromAssetQuantityAfter: Number,
  toAssetQuantityBefore: Number,
  toAssetQuantityAfter: Number,
  date: {
    type: Date,
    default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
