import { blockchainService } from './blockchainService';
import { logger } from '../utils/logger';

export interface Listing {
  id: string;
  gem_id: string;
  seller: string;
  listing_type: 'FixedPrice' | 'Auction';
  price: number;
  status: 'Active' | 'Sold' | 'Cancelled' | 'Expired';
  created_at: number;
  expires_at?: number;
  highest_bid?: number;
  highest_bidder?: string;
}

export interface Sale {
  id: string;
  listing_id: string;
  gem_id: string;
  seller: string;
  buyer: string;
  price: number;
  timestamp: number;
  royalty_paid: number;
}

export class MarketplaceService {
  private contractId: string;

  constructor() {
    this.contractId = process.env.MARKETPLACE_CONTRACT_ID || '';
    if (!this.contractId) {
      logger.warn('MARKETPLACE_CONTRACT_ID not set in environment');
    }
  }

  // Create a new listing
  async createListing(
    gemId: string,
    seller: string,
    listingType: 'FixedPrice' | 'Auction',
    price: number,
    durationSecs?: number
  ): Promise<{ listingId: string; transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'create_listing',
        {
          gem_id: gemId,
          seller,
          listing_type: listingType,
          price,
          duration_secs: durationSecs,
          timestamp: Math.floor(Date.now() / 1000),
        },
        seller
      );

      logger.info(`Listing created: ${result.listing_id} for gem: ${gemId}`);
      return {
        listingId: result.listing_id,
        transactionId: result.transaction_id,
      };
    } catch (error) {
      logger.error('Failed to create listing:', error);
      throw new Error('Failed to create listing');
    }
  }

  // Buy a gem at fixed price
  async buyGem(
    listingId: string,
    buyer: string,
    paymentAmount: number,
    creator: string
  ): Promise<{ saleId: string; transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'buy',
        {
          listing_id: listingId,
          buyer,
          payment_amount: paymentAmount,
          timestamp: Math.floor(Date.now() / 1000),
          creator,
        },
        buyer
      );

      logger.info(`Gem purchased: listing ${listingId} by ${buyer}`);
      return {
        saleId: result.sale_id,
        transactionId: result.transaction_id,
      };
    } catch (error) {
      logger.error('Failed to buy gem:', error);
      throw new Error('Failed to purchase gem');
    }
  }

  // Place bid on auction
  async placeBid(
    listingId: string,
    bidder: string,
    bidAmount: number
  ): Promise<{ transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'place_bid',
        {
          listing_id: listingId,
          bidder,
          bid_amount: bidAmount,
          timestamp: Math.floor(Date.now() / 1000),
        },
        bidder
      );

      logger.info(`Bid placed: ${bidAmount} on listing ${listingId} by ${bidder}`);
      return { transactionId: result.transaction_id };
    } catch (error) {
      logger.error('Failed to place bid:', error);
      throw new Error('Failed to place bid');
    }
  }

  // End auction
  async endAuction(
    listingId: string,
    caller: string,
    creator: string
  ): Promise<{ saleId?: string; transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'end_auction',
        {
          listing_id: listingId,
          timestamp: Math.floor(Date.now() / 1000),
          creator,
        },
        caller
      );

      logger.info(`Auction ended: listing ${listingId}`);
      return {
        saleId: result.sale_id,
        transactionId: result.transaction_id,
      };
    } catch (error) {
      logger.error('Failed to end auction:', error);
      throw new Error('Failed to end auction');
    }
  }

  // Cancel listing
  async cancelListing(
    listingId: string,
    seller: string
  ): Promise<{ transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'cancel_listing',
        {
          listing_id: listingId,
          seller,
        },
        seller
      );

      logger.info(`Listing cancelled: ${listingId} by ${seller}`);
      return { transactionId: result.transaction_id };
    } catch (error) {
      logger.error('Failed to cancel listing:', error);
      throw new Error('Failed to cancel listing');
    }
  }

  // Get active listings
  async getActiveListings(): Promise<Listing[]> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_active_listings',
        {},
        'system'
      );

      return result.listings || [];
    } catch (error) {
      logger.error('Failed to get active listings:', error);
      return [];
    }
  }

  // Get listing details
  async getListing(listingId: string): Promise<Listing | null> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_listing',
        { listing_id: listingId },
        'system'
      );

      return result.listing || null;
    } catch (error) {
      logger.error(`Failed to get listing ${listingId}:`, error);
      return null;
    }
  }

  // Get sales history
  async getSalesHistory(): Promise<Sale[]> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_sales_history',
        {},
        'system'
      );

      return result.sales || [];
    } catch (error) {
      logger.error('Failed to get sales history:', error);
      return [];
    }
  }

  // Get escrow balance
  async getBalance(address: string): Promise<number> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_balance',
        { address },
        'system'
      );

      return result.balance || 0;
    } catch (error) {
      logger.error(`Failed to get balance for ${address}:`, error);
      return 0;
    }
  }

  // Withdraw escrow balance
  async withdraw(address: string): Promise<{ amount: number; transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'withdraw',
        { address },
        address
      );

      logger.info(`Withdrawal: ${result.amount} for ${address}`);
      return {
        amount: result.amount,
        transactionId: result.transaction_id,
      };
    } catch (error) {
      logger.error('Failed to withdraw:', error);
      throw new Error('Failed to withdraw funds');
    }
  }
}

export const marketplaceService = new MarketplaceService();
