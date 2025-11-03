use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Listing types
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ListingType {
    FixedPrice,
    Auction,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ListingStatus {
    Active,
    Sold,
    Cancelled,
    Expired,
}

// Marketplace listing
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Listing {
    pub id: String,
    pub gem_id: String,
    pub seller: String,
    pub listing_type: ListingType,
    pub price: f64,
    pub status: ListingStatus,
    pub created_at: u64,
    pub expires_at: Option<u64>,
    pub highest_bid: Option<f64>,
    pub highest_bidder: Option<String>,
}

// Sale record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Sale {
    pub id: String,
    pub listing_id: String,
    pub gem_id: String,
    pub seller: String,
    pub buyer: String,
    pub price: f64,
    pub timestamp: u64,
    pub royalty_paid: f64,
}

// Marketplace contract state
#[derive(Debug, Serialize, Deserialize)]
pub struct MarketplaceContract {
    pub listings: HashMap<String, Listing>,
    pub sales_history: Vec<Sale>,
    pub active_listings: Vec<String>,
    pub listing_counter: u64,
    pub sale_counter: u64,
    pub contract_owner: String,
    pub marketplace_fee_percent: f64,
    pub royalty_percent: f64,
    pub escrow_balances: HashMap<String, f64>,
}

impl MarketplaceContract {
    pub fn new(contract_owner: String, marketplace_fee: f64, royalty: f64) -> Self {
        Self {
            listings: HashMap::new(),
            sales_history: Vec::new(),
            active_listings: Vec::new(),
            listing_counter: 0,
            sale_counter: 0,
            contract_owner,
            marketplace_fee_percent: marketplace_fee,
            royalty_percent: royalty,
            escrow_balances: HashMap::new(),
        }
    }

    // Create a new listing
    pub fn create_listing(
        &mut self,
        gem_id: String,
        seller: String,
        listing_type: ListingType,
        price: f64,
        duration_secs: Option<u64>,
        timestamp: u64,
    ) -> Result<String, String> {
        if price <= 0.0 {
            return Err("Price must be positive".to_string());
        }

        let listing_id = format!("LISTING-{}", self.listing_counter);
        self.listing_counter += 1;

        let expires_at = duration_secs.map(|d| timestamp + d);

        let listing = Listing {
            id: listing_id.clone(),
            gem_id: gem_id.clone(),
            seller: seller.clone(),
            listing_type,
            price,
            status: ListingStatus::Active,
            created_at: timestamp,
            expires_at,
            highest_bid: None,
            highest_bidder: None,
        };

        self.listings.insert(listing_id.clone(), listing);
        self.active_listings.push(listing_id.clone());

        Ok(listing_id)
    }

    // Buy a gem at fixed price
    pub fn buy(
        &mut self,
        listing_id: &str,
        buyer: String,
        payment_amount: f64,
        timestamp: u64,
        creator: String,
    ) -> Result<String, String> {
        let listing = self.listings.get_mut(listing_id)
            .ok_or_else(|| "Listing not found".to_string())?;

        if listing.status != ListingStatus::Active {
            return Err("Listing is not active".to_string());
        }

        if listing.listing_type != ListingType::FixedPrice {
            return Err("Not a fixed price listing".to_string());
        }

        if payment_amount < listing.price {
            return Err("Insufficient payment".to_string());
        }

        if let Some(expires) = listing.expires_at {
            if timestamp > expires {
                listing.status = ListingStatus::Expired;
                return Err("Listing has expired".to_string());
            }
        }

        // Calculate fees
        let marketplace_fee = listing.price * (self.marketplace_fee_percent / 100.0);
        let royalty = listing.price * (self.royalty_percent / 100.0);
        let seller_amount = listing.price - marketplace_fee - royalty;

        // Update escrow balances
        *self.escrow_balances.entry(listing.seller.clone()).or_insert(0.0) += seller_amount;
        *self.escrow_balances.entry(creator).or_insert(0.0) += royalty;
        *self.escrow_balances.entry(self.contract_owner.clone()).or_insert(0.0) += marketplace_fee;

        // Record sale
        let sale_id = format!("SALE-{}", self.sale_counter);
        self.sale_counter += 1;

        let sale = Sale {
            id: sale_id.clone(),
            listing_id: listing_id.to_string(),
            gem_id: listing.gem_id.clone(),
            seller: listing.seller.clone(),
            buyer: buyer.clone(),
            price: listing.price,
            timestamp,
            royalty_paid: royalty,
        };

        self.sales_history.push(sale);

        // Update listing status
        listing.status = ListingStatus::Sold;
        self.active_listings.retain(|id| id != listing_id);

        Ok(sale_id)
    }

    // Place bid on auction
    pub fn place_bid(
        &mut self,
        listing_id: &str,
        bidder: String,
        bid_amount: f64,
        timestamp: u64,
    ) -> Result<(), String> {
        let listing = self.listings.get_mut(listing_id)
            .ok_or_else(|| "Listing not found".to_string())?;

        if listing.status != ListingStatus::Active {
            return Err("Listing is not active".to_string());
        }

        if listing.listing_type != ListingType::Auction {
            return Err("Not an auction listing".to_string());
        }

        if let Some(expires) = listing.expires_at {
            if timestamp > expires {
                listing.status = ListingStatus::Expired;
                return Err("Auction has expired".to_string());
            }
        }

        let minimum_bid = listing.highest_bid.unwrap_or(listing.price);
        if bid_amount <= minimum_bid {
            return Err("Bid must be higher than current bid".to_string());
        }

        // Return previous bid to previous bidder
        if let (Some(prev_bidder), Some(prev_bid)) = (&listing.highest_bidder, listing.highest_bid) {
            *self.escrow_balances.entry(prev_bidder.clone()).or_insert(0.0) += prev_bid;
        }

        // Hold new bid in escrow
        *self.escrow_balances.entry(bidder.clone()).or_insert(0.0) -= bid_amount;

        listing.highest_bid = Some(bid_amount);
        listing.highest_bidder = Some(bidder);

        Ok(())
    }

    // End auction and finalize sale
    pub fn end_auction(
        &mut self,
        listing_id: &str,
        timestamp: u64,
        creator: String,
    ) -> Result<Option<String>, String> {
        let listing = self.listings.get_mut(listing_id)
            .ok_or_else(|| "Listing not found".to_string())?;

        if listing.status != ListingStatus::Active {
            return Err("Listing is not active".to_string());
        }

        if listing.listing_type != ListingType::Auction {
            return Err("Not an auction listing".to_string());
        }

        if let Some(expires) = listing.expires_at {
            if timestamp < expires {
                return Err("Auction has not expired yet".to_string());
            }
        }

        // Check if there were any bids
        if let (Some(winner), Some(winning_bid)) = (&listing.highest_bidder, listing.highest_bid) {
            // Calculate fees
            let marketplace_fee = winning_bid * (self.marketplace_fee_percent / 100.0);
            let royalty = winning_bid * (self.royalty_percent / 100.0);
            let seller_amount = winning_bid - marketplace_fee - royalty;

            // Distribute funds
            *self.escrow_balances.entry(listing.seller.clone()).or_insert(0.0) += seller_amount;
            *self.escrow_balances.entry(creator).or_insert(0.0) += royalty;
            *self.escrow_balances.entry(self.contract_owner.clone()).or_insert(0.0) += marketplace_fee;

            // Record sale
            let sale_id = format!("SALE-{}", self.sale_counter);
            self.sale_counter += 1;

            let sale = Sale {
                id: sale_id.clone(),
                listing_id: listing_id.to_string(),
                gem_id: listing.gem_id.clone(),
                seller: listing.seller.clone(),
                buyer: winner.clone(),
                price: winning_bid,
                timestamp,
                royalty_paid: royalty,
            };

            self.sales_history.push(sale);
            listing.status = ListingStatus::Sold;
            self.active_listings.retain(|id| id != listing_id);

            Ok(Some(sale_id))
        } else {
            // No bids, cancel the auction
            listing.status = ListingStatus::Expired;
            self.active_listings.retain(|id| id != listing_id);
            Ok(None)
        }
    }

    // Cancel a listing
    pub fn cancel_listing(
        &mut self,
        listing_id: &str,
        seller: &str,
    ) -> Result<(), String> {
        let listing = self.listings.get_mut(listing_id)
            .ok_or_else(|| "Listing not found".to_string())?;

        if listing.seller != seller {
            return Err("Only seller can cancel listing".to_string());
        }

        if listing.status != ListingStatus::Active {
            return Err("Listing is not active".to_string());
        }

        // Return any bids if it's an auction
        if let (Some(bidder), Some(bid_amount)) = (&listing.highest_bidder, listing.highest_bid) {
            *self.escrow_balances.entry(bidder.clone()).or_insert(0.0) += bid_amount;
        }

        listing.status = ListingStatus::Cancelled;
        self.active_listings.retain(|id| id != listing_id);

        Ok(())
    }

    // Get active listings
    pub fn get_active_listings(&self) -> Vec<&Listing> {
        self.active_listings
            .iter()
            .filter_map(|id| self.listings.get(id))
            .collect()
    }

    // Get listing details
    pub fn get_listing(&self, listing_id: &str) -> Option<&Listing> {
        self.listings.get(listing_id)
    }

    // Get sales history
    pub fn get_sales_history(&self) -> &[Sale] {
        &self.sales_history
    }

    // Withdraw escrow balance
    pub fn withdraw(&mut self, address: &str) -> Result<f64, String> {
        let balance = self.escrow_balances.get(address).copied().unwrap_or(0.0);

        if balance <= 0.0 {
            return Err("No balance to withdraw".to_string());
        }

        self.escrow_balances.insert(address.to_string(), 0.0);
        Ok(balance)
    }

    // Get escrow balance
    pub fn get_balance(&self, address: &str) -> f64 {
        self.escrow_balances.get(address).copied().unwrap_or(0.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_listing() {
        let mut marketplace = MarketplaceContract::new("admin".to_string(), 2.5, 5.0);

        let listing_id = marketplace.create_listing(
            "GEM-1".to_string(),
            "alice".to_string(),
            ListingType::FixedPrice,
            100.0,
            None,
            1234567890,
        ).unwrap();

        assert_eq!(listing_id, "LISTING-0");
        assert_eq!(marketplace.active_listings.len(), 1);
    }

    #[test]
    fn test_buy_gem() {
        let mut marketplace = MarketplaceContract::new("admin".to_string(), 2.5, 5.0);

        let listing_id = marketplace.create_listing(
            "GEM-1".to_string(),
            "alice".to_string(),
            ListingType::FixedPrice,
            100.0,
            None,
            1234567890,
        ).unwrap();

        let sale_id = marketplace.buy(
            &listing_id,
            "bob".to_string(),
            100.0,
            1234567891,
            "creator".to_string(),
        ).unwrap();

        assert_eq!(sale_id, "SALE-0");
        assert_eq!(marketplace.active_listings.len(), 0);

        // Check balances: seller gets 92.5, creator gets 5, admin gets 2.5
        assert_eq!(marketplace.get_balance("alice"), 92.5);
        assert_eq!(marketplace.get_balance("creator"), 5.0);
        assert_eq!(marketplace.get_balance("admin"), 2.5);
    }

    #[test]
    fn test_auction_bidding() {
        let mut marketplace = MarketplaceContract::new("admin".to_string(), 2.5, 5.0);

        let listing_id = marketplace.create_listing(
            "GEM-1".to_string(),
            "alice".to_string(),
            ListingType::Auction,
            100.0,
            Some(86400), // 1 day
            1234567890,
        ).unwrap();

        marketplace.place_bid(&listing_id, "bob".to_string(), 110.0, 1234567900).unwrap();
        marketplace.place_bid(&listing_id, "charlie".to_string(), 120.0, 1234567910).unwrap();

        let listing = marketplace.get_listing(&listing_id).unwrap();
        assert_eq!(listing.highest_bid, Some(120.0));
        assert_eq!(listing.highest_bidder, Some("charlie".to_string()));
    }

    #[test]
    fn test_cancel_listing() {
        let mut marketplace = MarketplaceContract::new("admin".to_string(), 2.5, 5.0);

        let listing_id = marketplace.create_listing(
            "GEM-1".to_string(),
            "alice".to_string(),
            ListingType::FixedPrice,
            100.0,
            None,
            1234567890,
        ).unwrap();

        marketplace.cancel_listing(&listing_id, "alice").unwrap();

        let listing = marketplace.get_listing(&listing_id).unwrap();
        assert_eq!(listing.status, ListingStatus::Cancelled);
        assert_eq!(marketplace.active_listings.len(), 0);
    }
}
