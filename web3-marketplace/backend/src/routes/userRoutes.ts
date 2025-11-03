import { Router, Request, Response, NextFunction } from 'express';
import { blockchainService } from '../services/blockchainService';
import { gemService } from '../services/gemService';
import { marketplaceService } from '../services/marketplaceService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get user profile (wallet + gems + balance)
router.get('/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params;

    // Get wallet info
    const wallet = await blockchainService.getWallet(address);

    // Get user's gems
    const gems = await gemService.getGemsByOwner(address);

    // Get blockchain balance
    const blockchainBalance = await blockchainService.getBalance(address);

    // Get marketplace escrow balance
    const escrowBalance = await marketplaceService.getBalance(address);

    res.json({
      success: true,
      data: {
        address,
        wallet,
        gems,
        balance: {
          blockchain: blockchainBalance,
          escrow: escrowBalance,
          total: blockchainBalance + escrowBalance,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create wallet
router.post('/wallet', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new AppError('Wallet name is required', 400);
    }

    const wallet = await blockchainService.createWallet(name);

    res.status(201).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    next(error);
  }
});

// List all wallets
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallets = await blockchainService.listWallets();

    res.json({
      success: true,
      data: wallets,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
