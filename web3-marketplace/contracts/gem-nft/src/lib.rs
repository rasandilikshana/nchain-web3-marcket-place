use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// Gem rarity levels
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum GemRarity {
    Common,
    Uncommon,
    Rare,
    Epic,
    Legendary,
    Mythic,
}

// Gem attributes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GemAttributes {
    pub color: String,
    pub rarity: GemRarity,
    pub power: u32,
    pub shine: u32,
    pub durability: u32,
}

// Individual Gem NFT
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Gem {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub creator: String,
    pub attributes: GemAttributes,
    pub metadata_uri: String,
    pub created_at: u64,
    pub transfer_count: u32,
}

// Contract state
#[derive(Debug, Serialize, Deserialize)]
pub struct GemNFTContract {
    pub gems: HashMap<String, Gem>,
    pub owner_gems: HashMap<String, Vec<String>>,
    pub total_supply: u64,
    pub contract_owner: String,
}

impl GemNFTContract {
    pub fn new(contract_owner: String) -> Self {
        Self {
            gems: HashMap::new(),
            owner_gems: HashMap::new(),
            total_supply: 0,
            contract_owner,
        }
    }

    // Mint a new gem
    pub fn mint(
        &mut self,
        name: String,
        owner: String,
        attributes: GemAttributes,
        metadata_uri: String,
        timestamp: u64,
    ) -> Result<String, String> {
        let gem_id = format!("GEM-{}", self.total_supply);

        let gem = Gem {
            id: gem_id.clone(),
            name,
            owner: owner.clone(),
            creator: owner.clone(),
            attributes,
            metadata_uri,
            created_at: timestamp,
            transfer_count: 0,
        };

        self.gems.insert(gem_id.clone(), gem);
        self.owner_gems
            .entry(owner)
            .or_insert_with(Vec::new)
            .push(gem_id.clone());

        self.total_supply += 1;

        Ok(gem_id)
    }

    // Transfer gem ownership
    pub fn transfer(
        &mut self,
        gem_id: &str,
        from: &str,
        to: String,
    ) -> Result<(), String> {
        let gem = self.gems.get_mut(gem_id)
            .ok_or_else(|| "Gem not found".to_string())?;

        if gem.owner != from {
            return Err("Not the owner".to_string());
        }

        // Remove from old owner
        if let Some(owner_list) = self.owner_gems.get_mut(from) {
            owner_list.retain(|id| id != gem_id);
        }

        // Add to new owner
        self.owner_gems
            .entry(to.clone())
            .or_insert_with(Vec::new)
            .push(gem_id.to_string());

        gem.owner = to;
        gem.transfer_count += 1;

        Ok(())
    }

    // Get gem details
    pub fn get_gem(&self, gem_id: &str) -> Option<&Gem> {
        self.gems.get(gem_id)
    }

    // Get all gems owned by an address
    pub fn get_gems_by_owner(&self, owner: &str) -> Vec<&Gem> {
        self.owner_gems
            .get(owner)
            .map(|gem_ids| {
                gem_ids
                    .iter()
                    .filter_map(|id| self.gems.get(id))
                    .collect()
            })
            .unwrap_or_default()
    }

    // Get total supply
    pub fn total_supply(&self) -> u64 {
        self.total_supply
    }

    // Verify ownership
    pub fn is_owner(&self, gem_id: &str, address: &str) -> bool {
        self.gems
            .get(gem_id)
            .map(|gem| gem.owner == address)
            .unwrap_or(false)
    }
}

// WASM exports
#[no_mangle]
pub extern "C" fn init() -> *mut u8 {
    let contract = GemNFTContract::new("system".to_string());
    let json = serde_json::to_string(&contract).unwrap();
    let bytes = json.as_bytes().to_vec();
    let ptr = bytes.as_ptr() as *mut u8;
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn mint(
    state_ptr: *const u8,
    state_len: usize,
    name_ptr: *const u8,
    name_len: usize,
    owner_ptr: *const u8,
    owner_len: usize,
) -> *mut u8 {
    // Parse input
    let state_bytes = unsafe { std::slice::from_raw_parts(state_ptr, state_len) };
    let name_bytes = unsafe { std::slice::from_raw_parts(name_ptr, name_len) };
    let owner_bytes = unsafe { std::slice::from_raw_parts(owner_ptr, owner_len) };

    let mut contract: GemNFTContract = serde_json::from_slice(state_bytes).unwrap();
    let name = String::from_utf8(name_bytes.to_vec()).unwrap();
    let owner = String::from_utf8(owner_bytes.to_vec()).unwrap();

    // Generate random attributes (in real implementation, use proper randomness)
    let attributes = GemAttributes {
        color: "Blue".to_string(),
        rarity: GemRarity::Common,
        power: 50,
        shine: 70,
        durability: 80,
    };

    let gem_id = contract.mint(
        name,
        owner,
        attributes,
        "ipfs://...".to_string(),
        0,
    ).unwrap();

    // Return updated state and gem_id
    let result = serde_json::json!({
        "state": contract,
        "gem_id": gem_id
    });

    let json = serde_json::to_string(&result).unwrap();
    let bytes = json.as_bytes().to_vec();
    let ptr = bytes.as_ptr() as *mut u8;
    std::mem::forget(bytes);
    ptr
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mint_gem() {
        let mut contract = GemNFTContract::new("admin".to_string());

        let attributes = GemAttributes {
            color: "Red".to_string(),
            rarity: GemRarity::Rare,
            power: 100,
            shine: 90,
            durability: 85,
        };

        let gem_id = contract.mint(
            "Ruby Gem".to_string(),
            "alice".to_string(),
            attributes,
            "ipfs://test".to_string(),
            1234567890,
        ).unwrap();

        assert_eq!(gem_id, "GEM-0");
        assert_eq!(contract.total_supply(), 1);
        assert!(contract.is_owner(&gem_id, "alice"));
    }

    #[test]
    fn test_transfer_gem() {
        let mut contract = GemNFTContract::new("admin".to_string());

        let attributes = GemAttributes {
            color: "Green".to_string(),
            rarity: GemRarity::Common,
            power: 50,
            shine: 60,
            durability: 70,
        };

        let gem_id = contract.mint(
            "Emerald".to_string(),
            "alice".to_string(),
            attributes,
            "ipfs://test".to_string(),
            1234567890,
        ).unwrap();

        contract.transfer(&gem_id, "alice", "bob".to_string()).unwrap();

        assert!(contract.is_owner(&gem_id, "bob"));
        assert!(!contract.is_owner(&gem_id, "alice"));

        let gem = contract.get_gem(&gem_id).unwrap();
        assert_eq!(gem.transfer_count, 1);
    }

    #[test]
    fn test_get_gems_by_owner() {
        let mut contract = GemNFTContract::new("admin".to_string());

        let attributes = GemAttributes {
            color: "Blue".to_string(),
            rarity: GemRarity::Uncommon,
            power: 60,
            shine: 70,
            durability: 75,
        };

        contract.mint(
            "Sapphire 1".to_string(),
            "alice".to_string(),
            attributes.clone(),
            "ipfs://test1".to_string(),
            1234567890,
        ).unwrap();

        contract.mint(
            "Sapphire 2".to_string(),
            "alice".to_string(),
            attributes,
            "ipfs://test2".to_string(),
            1234567891,
        ).unwrap();

        let alice_gems = contract.get_gems_by_owner("alice");
        assert_eq!(alice_gems.len(), 2);
    }
}
