const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  assignedTo: { type: String, required: true }, // Name or ID of the personnel
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Assigned', 'Expended'], default: 'Assigned' },
  assignedAt: { type: Date, default: Date.now },
  expendedAt: { type: Date }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
