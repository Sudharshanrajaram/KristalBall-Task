const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const assetRoutes = require('./routes/assetsRoutes');
const baseRoutes = require('./routes/baseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const transferRoutes = require('./routes/transferRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cors = require('cors');

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/bases', baseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});