import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

export class BlockchainService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NCHAIN_API_URL || 'http://localhost:8080/api';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for debugging
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Blockchain API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          status: error.response?.status,
          responseData: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  // Get blockchain info
  async getBlockchainInfo() {
    try {
      const response = await this.client.get('/blockchain/info');
      return response.data;
    } catch (error) {
      logger.error('Failed to get blockchain info:', error);
      throw new Error('Blockchain service unavailable');
    }
  }

  // Deploy contract
  async deployContract(name: string, wasmBytecode: string, owner: string) {
    try {
      const response = await this.client.post('/contracts', {
        name,
        bytecode: wasmBytecode,
        owner,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to deploy contract:', error);
      throw error;
    }
  }

  // Call contract method
  async callContract(contractId: string, method: string, args: any, caller: string) {
    try {
      const response = await this.client.post(`/contracts/${contractId}/call`, {
        function: method,
        args,
        caller,
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to call contract ${contractId}.${method}:`, error);
      throw error;
    }
  }

  // Create transaction
  async createTransaction(from: string, to: string, amount: number, data?: string) {
    try {
      const response = await this.client.post('/transactions', {
        from,
        to,
        amount,
        data,
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to create transaction:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance(address: string) {
    try {
      const response = await this.client.get(`/balance/${address}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get balance for ${address}:`, error);
      throw error;
    }
  }

  // Create wallet
  async createWallet(name: string) {
    try {
      const response = await this.client.post('/wallets', { name });
      return response.data;
    } catch (error) {
      logger.error('Failed to create wallet:', error);
      throw error;
    }
  }

  // Get wallet details
  async getWallet(address: string) {
    try {
      const response = await this.client.get(`/wallets/${address}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get wallet ${address}:`, error);
      throw error;
    }
  }

  // List all wallets
  async listWallets() {
    try {
      const response = await this.client.get('/wallets');
      return response.data;
    } catch (error) {
      logger.error('Failed to list wallets:', error);
      throw error;
    }
  }

  // Get transaction details
  async getTransaction(txId: string) {
    try {
      const response = await this.client.get(`/transactions/${txId}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get transaction ${txId}:`, error);
      throw error;
    }
  }

  // Get recent transactions
  async getRecentTransactions(limit: number = 10) {
    try {
      const response = await this.client.get(`/transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get recent transactions:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
