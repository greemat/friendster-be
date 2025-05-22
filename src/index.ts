// Entry point for the server. Sets up the Express app, middleware, connects to Firebase Admin SDK, and starts listening on the configured port.

require('dotenv').config(); // Load .env variables
import './utils/firebaseAdmin'; // Initialize Firebase Admin

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
