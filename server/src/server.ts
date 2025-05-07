import cors from 'cors';
import express, { Request, Response } from 'express';
import passport from 'passport';
import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import { configurePassport } from './services/authService';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDatabase();

// Basic middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.VITE_CLIENT_URL,
    credentials: true,
  })
);

// Auth setup
configurePassport();
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
