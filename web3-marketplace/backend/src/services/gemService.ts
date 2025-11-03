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
  private gemCache: Map<string, Gem> = new Map(); // MVP: In-memory gem storage

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
      // MVP: Use blockchain transactions with embedded gem data instead of smart contracts
      const gemId = `gem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const gemData = {
        action: 'MINT_GEM',
        gem_id: gemId,
        name,
        owner,
        creator: owner,
        attributes,
        metadata_uri: metadataUri,
        timestamp: Math.floor(Date.now() / 1000),
        transfer_count: 0,
      };

      // MVP: Skip blockchain transaction for now, just cache the gem
      // TODO: Re-enable blockchain transaction once contract deployment works
      this.gemCache.set(gemId, gemData as any);

      logger.info(`Gem minted (MVP in-memory): ${gemId} for owner: ${owner}`);
      return {
        gemId,
        transactionId: `mvp_tx_${Date.now()}`,
      };
    } catch (error: any) {
      logger.error('Failed to mint gem:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      throw new Error(`Failed to mint gem: ${error.message}`);
    }
  }

  // Transfer gem ownership
  async transferGem(
    gemId: string,
    from: string,
    to: string
  ): Promise<{ transactionId: string }> {
    try {
      // MVP: Update cache
      const gem = this.gemCache.get(gemId);
      if (!gem) {
        throw new Error('Gem not found');
      }
      if (gem.owner !== from) {
        throw new Error('Not the owner');
      }

      // MVP: Skip blockchain transaction for now
      // TODO: Re-enable blockchain transaction once contract deployment works

      // Update cache
      gem.owner = to;
      gem.transfer_count++;
      this.gemCache.set(gemId, gem);

      logger.info(`Gem ${gemId} transferred from ${from} to ${to} (MVP in-memory)`);
      return { transactionId: `mvp_tx_${Date.now()}` };
    } catch (error) {
      logger.error('Failed to transfer gem:', error);
      throw new Error('Failed to transfer gem');
    }
  }

  // Get gem details
  async getGem(gemId: string): Promise<Gem | null> {
    try {
      // MVP: Use cache
      return this.gemCache.get(gemId) || null;
    } catch (error) {
      logger.error(`Failed to get gem ${gemId}:`, error);
      return null;
    }
  }

  // Get gems by owner
  async getGemsByOwner(owner: string): Promise<Gem[]> {
    try {
      // MVP: Filter cache by owner
      const gems: Gem[] = [];
      for (const gem of this.gemCache.values()) {
        if (gem.owner === owner) {
          gems.push(gem);
        }
      }
      return gems;
    } catch (error) {
      logger.error(`Failed to get gems for owner ${owner}:`, error);
      return [];
    }
  }

  // Get total supply
  async getTotalSupply(): Promise<number> {
    try {
      // MVP: Count cache
      return this.gemCache.size;
    } catch (error) {
      logger.error('Failed to get total supply:', error);
      return 0;
    }
  }

  // Verify ownership
  async verifyOwnership(gemId: string, address: string): Promise<boolean> {
    try {
      // MVP: Check cache
      const gem = this.gemCache.get(gemId);
      return gem ? gem.owner === address : false;
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
