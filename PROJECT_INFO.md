# 📋 Project Information

## Repository Structure

This is a **wrapper repository** that automatically clones and sets up the nchain blockchain marketplace.

### Your Repository (Wrapper)
```
https://github.com/rasandilikshana/nchain-web3-marcket-place.git
```

### Original Repository (Auto-cloned)
```
https://github.com/narthanaj/nchain.git
```

---

## How It Works

1. **User clones YOUR wrapper repo**
   ```bash
   git clone https://github.com/rasandilikshana/nchain-web3-marcket-place.git
   ```

2. **User runs setup script**
   ```bash
   ./setup.sh
   ```

3. **Setup script automatically:**
   - Clones nchain repository into `nchain/` folder
   - Builds the blockchain
   - Sets up backend and frontend
   - Creates all configuration files

4. **User starts services and tests**
   - 3 terminals for blockchain, backend, frontend
   - Run `./run-tests.sh` to verify everything works

---

## Project Structure

```
nchain-web3-marcket-place/          # Your wrapper repo
├── README.md                        # Main documentation
├── setup.sh                         # Automated setup (clones nchain)
├── run-tests.sh                     # Test runner
├── .gitignore                       # Excludes nchain/ folder
│
├── docs/                            # All documentation
│   ├── START_HERE.md               # Quick start guide
│   ├── HOW_TO_TEST.md              # Testing guide
│   ├── MARKETPLACE_TESTING_GUIDE.md # API reference
│   ├── QUICK_REFERENCE.md          # Command reference
│   ├── CLAUDE.md                   # Technical docs
│   └── SHARE_WITH_FRIENDS.md       # Share message
│
└── nchain/                          # AUTO-CLONED (not in your repo)
    ├── Cargo.toml                   # Blockchain code
    ├── src/                         # Rust source
    └── web3-marketplace/            # Marketplace code
        ├── backend/                 # Node.js API
        └── frontend/                # React UI
```

---

## What's in YOUR Repository

**Committed files:**
- `README.md` - Main readme
- `setup.sh` - Auto-setup script
- `run-tests.sh` - Test runner
- `.gitignore` - Excludes nchain/
- `docs/` - All documentation

**NOT committed:**
- `nchain/` - Auto-cloned by setup.sh
- `node_modules/` - Installed by npm
- `.env` files - Created by setup.sh

---

## Workflow for Users

```
1. Clone wrapper repo
   ↓
2. Run ./setup.sh
   ↓
3. Script clones nchain automatically
   ↓
4. Script builds everything
   ↓
5. User starts 3 services
   ↓
6. User runs ./run-tests.sh
   ↓
7. User opens browser and tests! 🎉
```

---

## Benefits of This Structure

✅ **Simple for users** - Just 2 commands to get started
✅ **Always up-to-date** - Clones latest nchain code
✅ **Clean separation** - Wrapper repo is minimal
✅ **Easy to maintain** - Update docs without touching nchain
✅ **No duplication** - nchain code not duplicated
✅ **Flexible** - Can update nchain independently

---

## Updating

### Update Wrapper Repo
```bash
git pull origin main
```

### Update nchain
```bash
cd nchain
git pull origin main
cargo build --release
```

Or run `./setup.sh` again and choose "y" to update.

---

## Sharing

Share YOUR wrapper repo:
```
https://github.com/rasandilikshana/nchain-web3-marcket-place.git
```

Users clone it and run `./setup.sh` - that's all!

---

## File Sizes

**Your wrapper repo:**
- ~50 KB (just scripts and docs)

**After setup (with nchain):**
- ~500 MB (includes Rust dependencies and build artifacts)

---

## Maintenance

### Add/Update Documentation
```bash
# Edit files in docs/
git add docs/
git commit -m "Update documentation"
git push
```

### Update Setup Script
```bash
# Edit setup.sh
git add setup.sh
git commit -m "Improve setup script"
git push
```

### Don't Touch
- `nchain/` folder (auto-cloned)
- `node_modules/` (auto-installed)

---

## For Your Reference

**Your Wrapper Repo:**
- Repository: `rasandilikshana/nchain-web3-marcket-place`
- Purpose: Easy setup wrapper
- Size: Minimal (just scripts)
- Users: Clone this first

**Original nchain Repo:**
- Repository: `narthanaj/nchain`
- Purpose: Actual blockchain code
- Size: Large (full codebase)
- Users: Auto-cloned by setup.sh

---

**This structure makes it super easy for anyone to clone and run the marketplace!**
