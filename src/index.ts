require('dotenv').config(); // Load .env variables before anything else
import './utils/firebaseAdmin'; // Ensure Firebase Admin initializes here

import express from 'express';
import firebaseConfigRoutes from './routes/firebaseConfigRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api', firebaseConfigRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
