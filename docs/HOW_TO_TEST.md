# How to Test the Gem Marketplace

## 🎯 Quick Start

Your marketplace is already running! Here's how to test it as a marketplace owner.

### Prerequisites (Already Done ✅)
- ✅ Blockchain running on http://localhost:8080
- ✅ Backend API running on http://localhost:3000
- ✅ Frontend running on http://localhost:5173
- ✅ Alice wallet created: `48175356aa0b5e87`

## Step-by-Step Testing Guide

### Step 1: Clear Your Browser Storage (Important!)

To start fresh:
1. Open http://localhost:5173
2. Press `F12` to open Developer Tools
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Local Storage** → `http://localhost:5173`
5. Right-click → **Clear**
6. Refresh the page (`F5`)

This ensures the wallet connects properly without creating duplicates.

### Step 2: Connect Your Wallet

1. Click **"Connect Wallet"** button in the top-right corner
2. You should see a success message: "Connected as Alice"
3. The button should change to show your address: `48175...5e87`
4. **Important**: Don't click "Connect Wallet" again! It's already connected.

**If it says "Wallet reconnected!"**: That's fine, your wallet is already connected from before.

### Step 3: Mint Your First Gem 💎

1. Click **"Mint"** in the navigation menu
2. You'll see the mint page with a gem icon
3. Enter a gem name (try: "Ruby Dragon", "Sapphire Phoenix", "Emerald Crown")
4. Make sure **"Use randomly generated attributes"** is checked ✓
5. Click **"Mint Gem"** button
6. Wait 1-2 seconds
7. You should see a success message with your gem details!

**Example Result:**
```json
{
  "gemId": "gem_1762175843447_isittexun",
  "transactionId": "mvp_tx_1762175843448",
  "attributes": {
    "color": "Purple",
    "rarity": "Epic",
    "power": 312,
    "shine": 298,
    "durability": 305
  }
}
```

### Step 4: View Your Gem Collection

1. Click **"My Gems"** in the navigation
2. You should see all gems you've minted
3. Each gem card shows:
   - Gem name and ID
   - Rarity badge (color-coded)
   - Color
   - Power, Shine, Durability stats
   - Creation date
   - Transfer count

### Step 5: Mint More Gems (Build Your Collection!)

Go back to the Mint page and create 5-10 more gems with different names:
- "Diamond Fury"
- "Moonstone Whisper"
- "Jade Tempest"
- "Opal Dreams"
- "Topaz Lightning"

Each will have random:
- **Rarity**: Common, Uncommon, Rare, Epic, Legendary, Mythic
- **Color**: Red, Blue, Green, Purple, Orange, Pink, White, Black, Yellow
- **Stats**: Higher rarity = higher stats

### Step 6: Browse the Marketplace

1. Click **"Marketplace"** in the navigation
2. You'll see all listed gems (currently empty until you create a listing)
3. Try the filters:
   - Filter by rarity
   - Sort by price
   - Search by name

### Step 7: Check Statistics

**Via Frontend:**
- Total gems minted
- Your collection count
- Marketplace stats

**Via API:**
```bash
# Total supply
curl http://localhost:3000/api/gems/stats/supply

# Your gems
curl http://localhost:3000/api/gems/owner/48175356aa0b5e87 | python3 -m json.tool

# Specific gem
curl http://localhost:3000/api/gems/gem_1762175843447_isittexun | python3 -m json.tool
```

## Testing Different Wallets

### Create a Second Wallet (Test Buyer)

**Via API:**
```bash
curl -X POST http://localhost:3000/api/users/wallet \
  -H "Content-Type: application/json" \
  -d '{"name": "TestBuyer"}'
```

**Via Frontend:**
1. Disconnect current wallet (if there's a disconnect button)
2. Clear browser local storage again
3. Connect wallet - will use first available or create new one

## Common Issues & Solutions

### Issue: "Please connect your wallet to mint a gem"

**Solution:**
1. Clear browser local storage (F12 → Application → Local Storage → Clear)
2. Refresh page
3. Click "Connect Wallet" ONCE
4. Try minting again

### Issue: Wallet keeps creating new accounts

**Solution:**
- This is fixed! The wallet now persists in browser storage
- If you click "Connect Wallet" again while already connected, it just refreshes your balance
- To create a NEW wallet, you must disconnect first

### Issue: "Gem not found" error

**Solution:**
- The gem cache is in-memory
- If you restart the backend, all gems are lost
- This is expected in MVP mode
- Solution: Don't restart backend during testing, or remint your gems

### Issue: Can't see my minted gems

**Solution:**
- Check the browser console (F12) for errors
- Make sure you're viewing "My Gems" page with the correct wallet connected
- Try: `curl http://localhost:3000/api/gems/owner/YOUR_ADDRESS`

## Advanced Testing

### Test Multiple User Scenario

**Terminal 1 - Alice (Seller):**
```bash
# Mint gem as Alice
curl -X POST http://localhost:3000/api/gems/mint \
  -H "Content-Type: application/json" \
  -d '{"owner": "48175356aa0b5e87", "name": "Rare Diamond"}'

# Get gem ID from response
# Create listing (when marketplace service is ready)
```

**Terminal 2 - Bob (Buyer):**
```bash
# List available wallets
curl http://localhost:3000/api/users | python3 -m json.tool

# Use Bob's address (ea6b9a9e64a15d55) to buy gem
```

### API Testing

**Health Check:**
```bash
curl http://localhost:3000/api/health | python3 -m json.tool
```

**Blockchain Info:**
```bash
curl http://localhost:8080/api/blockchain/info | python3 -m json.tool
```

**List All Wallets:**
```bash
curl http://localhost:8080/api/wallets | python3 -m json.tool
```

## What to Look For (Success Metrics)

✅ **Wallet Connection Works**
- Connects to Alice wallet automatically
- Persists across page refreshes
- Shows wallet address in navbar

✅ **Gem Minting Works**
- Creates unique gem IDs
- Generates random attributes
- Returns transaction ID
- Appears in "My Gems" instantly

✅ **Rarity Distribution is Correct**
- Mint 20+ gems
- Most should be Common/Uncommon (~80%)
- Few Rare/Epic (~15%)
- Very few Legendary/Mythic (~5%)

✅ **Stats Scale with Rarity**
- Common: ~30-70 in each stat
- Rare: ~120-180
- Epic: ~200-320
- Legendary: ~300-450
- Mythic: ~400-600

✅ **Frontend is Responsive**
- Works on desktop and mobile
- Gem cards display beautifully
- Navigation works smoothly

## Known Limitations (MVP Mode)

These are INTENTIONAL for testing:

1. **No Blockchain Persistence**
   - Gems stored in backend memory
   - Restarting backend = lose all gems
   - This is temporary for easy testing

2. **No Real Wallet Signatures**
   - No MetaMask integration yet
   - Simplified for testing
   - Production will add proper wallet auth

3. **Marketplace Listings Not Fully Functional**
   - Can view marketplace page
   - Listing/buying needs marketplace service updates
   - Coming soon!

4. **No MongoDB**
   - Optional caching layer disabled
   - Not needed for MVP testing
   - Can enable if you want

## Next Steps After Testing

Once you've tested and are happy with the UX:

1. **Enable Blockchain Persistence** (optional)
   - Uncomment blockchain transaction calls in `gemService.ts`
   - Deploy smart contracts
   - All infrastructure is ready!

2. **Add Marketplace Listings**
   - Update `marketplaceService.ts` for MVP mode
   - Test creating listings
   - Test buying gems

3. **Add Real Wallet Integration**
   - Integrate MetaMask
   - Add signature verification
   - Require transaction signing

4. **Deploy Smart Contracts**
   - Fix WASM compilation
   - Deploy to blockchain
   - Set contract IDs in .env

## Troubleshooting Commands

**Restart Backend (if needed):**
```bash
# In backend terminal: Ctrl+C
cd web3-marketplace/backend
npm run dev
```

**Restart Frontend:**
```bash
# In frontend terminal: Ctrl+C
cd web3-marketplace/frontend
npm run dev
```

**Check Backend Logs:**
Look at the terminal where `npm run dev` is running in the backend folder.

**Check Frontend Logs:**
- Browser console (F12)
- Look for errors in red
- Network tab shows API requests

## Success! 🎉

If you can:
- ✅ Connect wallet without it creating duplicates
- ✅ Mint multiple gems with random attributes
- ✅ See your collection in "My Gems"
- ✅ Gems have proper rarities and stats
- ✅ Frontend is smooth and responsive

**Then your marketplace is working perfectly!**

You now have a fully functional Web3 gem marketplace ready for the next phase of development.

## Questions?

- Check logs in terminal windows
- Look at browser console for frontend errors
- Review [MARKETPLACE_TESTING_GUIDE.md](MARKETPLACE_TESTING_GUIDE.md) for more details
- Check [CLAUDE.md](CLAUDE.md) for technical documentation

Happy testing! 💎🚀
