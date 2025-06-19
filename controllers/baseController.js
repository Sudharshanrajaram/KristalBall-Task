const Base = require('../models/Base');

exports.createBase = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const existingBase = await Base.findOne({ name });
    if (existingBase) {
      return res.status(409).json({ message: 'Base with this name already exists' });
    }

    const newBase = new Base({ name, location });
    await newBase.save();

    res.status(201).json({ message: 'Base created successfully', base: newBase });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create base', error: err.message });
  }
};

exports.getBases = async (req, res) => {
  try {
    const bases = await Base.find();
    res.status(200).json(bases);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bases', error: err.message });
  }
};
