import { Router, Request, Response, NextFunction } from 'express';
import { marketplaceService } from '../services/marketplaceService';
import { AppError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createListingSchema = Joi.object({
  gemId: Joi.string().required(),
  seller: Joi.string().required(),
  listingType: Joi.string().valid('FixedPrice', 'Auction').required(),
  price: Joi.number().positive().required(),
  durationSecs: Joi.number().positive().optional(),
});

const buyGemSchema = Joi.object({
  buyer: Joi.string().required(),
  paymentAmount: Joi.number().positive().required(),
  creator: Joi.string().required(),
});

const placeBidSchema = Joi.object({
  bidder: Joi.string().required(),
  bidAmount: Joi.number().positive().required(),
});

// Create a new listing
router.post('/listings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createListingSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { gemId, seller, listingType, price, durationSecs } = value;

    const result = await marketplaceService.createListing(
      gemId,
      seller,
      listingType,
      price,
      durationSecs
    );

    res.status(201).json({
      success: true,
      data: {
        listingId: result.listingId,
        transactionId: result.transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get active listings
router.get('/listings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await marketplaceService.getActiveListings();

    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
});

// Get listing details
router.get('/listings/:listingId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const listing = await marketplaceService.getListing(listingId);

    if (!listing) {
      throw new AppError('Listing not found', 404);
    }

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
});

// Buy a gem
router.post('/listings/:listingId/buy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const { error, value } = buyGemSchema.validate(req.body);

    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { buyer, paymentAmount, creator } = value;

    const result = await marketplaceService.buyGem(
      listingId,
      buyer,
      paymentAmount,
      creator
    );

    res.json({
      success: true,
      data: {
        saleId: result.saleId,
        transactionId: result.transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Place bid on auction
router.post('/listings/:listingId/bid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const { error, value } = placeBidSchema.validate(req.body);

    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { bidder, bidAmount } = value;

    const result = await marketplaceService.placeBid(listingId, bidder, bidAmount);

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

// End auction
router.post('/listings/:listingId/end-auction', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const { caller, creator } = req.body;

    if (!caller || !creator) {
      throw new AppError('Caller and creator are required', 400);
    }

    const result = await marketplaceService.endAuction(listingId, caller, creator);

    res.json({
      success: true,
      data: {
        saleId: result.saleId,
        transactionId: result.transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Cancel listing
router.delete('/listings/:listingId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listingId } = req.params;
    const { seller } = req.body;

    if (!seller) {
      throw new AppError('Seller address is required', 400);
    }

    const result = await marketplaceService.cancelListing(listingId, seller);

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

// Get sales history
router.get('/sales', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sales = await marketplaceService.getSalesHistory();

    res.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    next(error);
  }
});

// Get escrow balance
router.get('/balance/:address', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.params;
    const balance = await marketplaceService.getBalance(address);

    res.json({
      success: true,
      data: { balance },
    });
  } catch (error) {
    next(error);
  }
});

// Withdraw escrow balance
router.post('/withdraw', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.body;

    if (!address) {
      throw new AppError('Address is required', 400);
    }

    const result = await marketplaceService.withdraw(address);

    res.json({
      success: true,
      data: {
        amount: result.amount,
        transactionId: result.transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
