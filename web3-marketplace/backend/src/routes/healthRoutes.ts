import { Router, Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const blockchainInfo = await blockchainService.getBlockchainInfo();

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        blockchain: {
          connected: true,
          ...blockchainInfo,
        },
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        blockchain: {
          connected: false,
        },
      },
    });
  }
});

export default router;
