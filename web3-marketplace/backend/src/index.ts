import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Routes
import gemRoutes from './routes/gemRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
}));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/gems', gemRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB (optional, for caching)
    if (process.env.MONGODB_URI) {
      await connectDatabase();
      logger.info('MongoDB connected');
    } else {
      logger.warn('MongoDB URI not provided, running without database caching');
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📡 nchain node: ${process.env.NCHAIN_API_URL}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
