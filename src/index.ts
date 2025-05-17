//index.ts
import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/api'; // ← this is your router

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', apiRoutes); // ✅ Pass router, not handler

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
