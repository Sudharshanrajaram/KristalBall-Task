const mongoose = require('mongoose');
const AssetSchema = new mongoose.Schema({
  name: String,
  type: String, 
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' },
  quantity: { type: Number, default: 1 },
   openingBalance: {
    type: Number,
    default: 0
  },
  closingBalance: {
    type: Number,
    default: 0
  },
  status: { type: String, enum: ['Available', 'Assigned', 'Expended', 'Soldout'], default: 'Available' }
});


module.exports = mongoose.model('Asset', AssetSchema);
