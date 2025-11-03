// Simple Gem NFT contract with WASM exports
// This is a minimal version that works with wasmtime

static mut COUNTER: u32 = 0;
static mut TOTAL_SUPPLY: u32 = 0;

#[no_mangle]
pub extern "C" fn mint() -> u32 {
    unsafe {
        TOTAL_SUPPLY += 1;
        COUNTER += 1;
        COUNTER
    }
}

#[no_mangle]
pub extern "C" fn get_total_supply() -> u32 {
    unsafe { TOTAL_SUPPLY }
}

#[no_mangle]
pub extern "C" fn transfer(_from: u32, _to: u32, _gem_id: u32) -> u32 {
    // Simple transfer - returns 1 for success
    1
}

#[no_mangle]
pub extern "C" fn get_balance(_owner: u32) -> u32 {
    unsafe { TOTAL_SUPPLY }
}
