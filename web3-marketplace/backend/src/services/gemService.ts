import { blockchainService } from './blockchainService';
import { logger } from '../utils/logger';

export interface GemAttributes {
  color: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  power: number;
  shine: number;
  durability: number;
}

export interface Gem {
  id: string;
  name: string;
  owner: string;
  creator: string;
  attributes: GemAttributes;
  metadata_uri: string;
  created_at: number;
  transfer_count: number;
}

export class GemService {
  private contractId: string;

  constructor() {
    this.contractId = process.env.GEM_NFT_CONTRACT_ID || '';
    if (!this.contractId) {
      logger.warn('GEM_NFT_CONTRACT_ID not set in environment');
    }
  }

  // Mint a new gem
  async mintGem(
    name: string,
    owner: string,
    attributes: GemAttributes,
    metadataUri: string
  ): Promise<{ gemId: string; transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'mint',
        {
          name,
          owner,
          attributes,
          metadata_uri: metadataUri,
          timestamp: Math.floor(Date.now() / 1000),
        },
        owner
      );

      logger.info(`Gem minted: ${result.gem_id} for owner: ${owner}`);
      return {
        gemId: result.gem_id,
        transactionId: result.transaction_id,
      };
    } catch (error) {
      logger.error('Failed to mint gem:', error);
      throw new Error('Failed to mint gem');
    }
  }

  // Transfer gem ownership
  async transferGem(
    gemId: string,
    from: string,
    to: string
  ): Promise<{ transactionId: string }> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'transfer',
        {
          gem_id: gemId,
          from,
          to,
        },
        from
      );

      logger.info(`Gem ${gemId} transferred from ${from} to ${to}`);
      return { transactionId: result.transaction_id };
    } catch (error) {
      logger.error('Failed to transfer gem:', error);
      throw new Error('Failed to transfer gem');
    }
  }

  // Get gem details
  async getGem(gemId: string): Promise<Gem | null> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_gem',
        { gem_id: gemId },
        'system'
      );

      return result.gem || null;
    } catch (error) {
      logger.error(`Failed to get gem ${gemId}:`, error);
      return null;
    }
  }

  // Get gems by owner
  async getGemsByOwner(owner: string): Promise<Gem[]> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'get_gems_by_owner',
        { owner },
        'system'
      );

      return result.gems || [];
    } catch (error) {
      logger.error(`Failed to get gems for owner ${owner}:`, error);
      return [];
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<number> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'total_supply',
        {},
        'system'
      );

      return result.total_supply || 0;
    } catch (error) {
      logger.error('Failed to get total supply:', error);
      return 0;
    }
  }

  // Verify ownership
  async verifyOwnership(gemId: string, address: string): Promise<boolean> {
    try {
      const result = await blockchainService.callContract(
        this.contractId,
        'is_owner',
        { gem_id: gemId, address },
        'system'
      );

      return result.is_owner || false;
    } catch (error) {
      logger.error('Failed to verify ownership:', error);
      return false;
    }
  }

  // Generate random gem attributes (helper for minting)
  generateRandomAttributes(): GemAttributes {
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White', 'Black'];
    const rarities: GemAttributes['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

    const rarityWeights = [50, 30, 15, 4, 0.9, 0.1]; // Probability weights
    const totalWeight = rarityWeights.reduce((a, b) => a + b, 0);
    const random = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let selectedRarity: GemAttributes['rarity'] = 'Common';

    for (let i = 0; i < rarities.length; i++) {
      cumulativeWeight += rarityWeights[i];
      if (random <= cumulativeWeight) {
        selectedRarity = rarities[i];
        break;
      }
    }

    // Stats scale with rarity
    const rarityMultiplier = rarities.indexOf(selectedRarity) + 1;
    const baseStats = 30 + Math.random() * 20;

    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      rarity: selectedRarity,
      power: Math.floor(baseStats * rarityMultiplier + Math.random() * 20),
      shine: Math.floor(baseStats * rarityMultiplier + Math.random() * 20),
      durability: Math.floor(baseStats * rarityMultiplier + Math.random() * 20),
    };
  }
}

export const gemService = new GemService();
