const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  role: {
    type: String,
    enum: ["Admin", "BaseCommander", "LogisticsOfficer"],
    required: true,
  },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
});

module.exports = mongoose.model("User", UserSchema);
