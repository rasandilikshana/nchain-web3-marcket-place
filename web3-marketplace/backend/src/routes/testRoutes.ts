import { Router, Request, Response } from 'express';
import { blockchainService } from '../services/blockchainService';
import { gemService } from '../services/gemService';

const router = Router();

// Test transaction creation
router.post('/test-tx', async (req: Request, res: Response) => {
  try {
    const result = await blockchainService.createTransaction(
      '48175356aa0b5e87',
      'gem_nft_v1',
      0.01,
      '{"test": "data"}'
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        response: error.response?.data,
      },
    });
  }
});

// Test gem mint
router.post('/test-mint', async (req: Request, res: Response) => {
  try {
    const attrs = gemService.generateRandomAttributes();
    const result = await gemService.mintGem(
      'Test Gem',
      '48175356aa0b5e87',
      attrs,
      'ipfs://test'
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      },
    });
  }
});

export default router;
