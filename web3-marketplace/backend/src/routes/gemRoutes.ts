import { Router, Request, Response, NextFunction } from 'express';
import { gemService } from '../services/gemService';
import { AppError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schemas
const mintGemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  owner: Joi.string().required(),
  metadataUri: Joi.string().uri().optional(),
  attributes: Joi.object({
    color: Joi.string().required(),
    rarity: Joi.string().valid('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic').required(),
    power: Joi.number().min(0).max(1000).required(),
    shine: Joi.number().min(0).max(1000).required(),
    durability: Joi.number().min(0).max(1000).required(),
  }).optional(),
});

const transferGemSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
});

// Mint a new gem
router.post('/mint', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = mintGemSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { name, owner, metadataUri, attributes } = value;

    // Generate random attributes if not provided
    const gemAttributes = attributes || gemService.generateRandomAttributes();

    const result = await gemService.mintGem(
      name,
      owner,
      gemAttributes,
      metadataUri || `ipfs://gem-${Date.now()}`
    );

    res.status(201).json({
      success: true,
      data: {
        gemId: result.gemId,
        transactionId: result.transactionId,
        attributes: gemAttributes,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get gem details
router.get('/:gemId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gemId } = req.params;
    const gem = await gemService.getGem(gemId);

    if (!gem) {
      throw new AppError('Gem not found', 404);
    }

    res.json({
      success: true,
      data: gem,
    });
  } catch (error) {
    next(error);
  }
});

// Transfer gem
router.post('/:gemId/transfer', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { gemId } = req.params;
    const { error, value } = transferGemSchema.validate(req.body);

    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { from, to } = value;

    // Verify ownership
    const isOwner = await gemService.verifyOwnership(gemId, from);
    if (!isOwner) {
      throw new AppError('Not the owner of this gem', 403);
    }

    const result = await gemService.transferGem(gemId, from, to);

    res.json({
      success: true,
      data: {
        transactionId: result.transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get gems by owner
router.get('/owner/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params;
    const gems = await gemService.getGemsByOwner(address);

    res.json({
      success: true,
      data: gems,
    });
  } catch (error) {
    next(error);
  }
});

// Get total supply
router.get('/stats/supply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSupply = await gemService.getTotalSupply();

    res.json({
      success: true,
      data: { totalSupply },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
