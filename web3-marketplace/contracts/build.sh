#!/bin/bash

set -e

echo "Building Gem NFT Contract..."
cd gem-nft
cargo build --target wasm32-unknown-unknown --release
cd ..

echo "Building Marketplace Contract..."
cd marketplace
cargo build --target wasm32-unknown-unknown --release
cd ..

echo "Optimizing WASM files..."
if command -v wasm-opt &> /dev/null; then
    wasm-opt -Oz -o gem-nft/gem_nft.wasm gem-nft/target/wasm32-unknown-unknown/release/gem_nft.wasm
    wasm-opt -Oz -o marketplace/gem_marketplace.wasm marketplace/target/wasm32-unknown-unknown/release/gem_marketplace.wasm
    echo "WASM files optimized successfully!"
else
    echo "Warning: wasm-opt not found. Install it with: cargo install wasm-opt"
    cp gem-nft/target/wasm32-unknown-unknown/release/gem_nft.wasm gem-nft/gem_nft.wasm
    cp marketplace/target/wasm32-unknown-unknown/release/gem_marketplace.wasm marketplace/gem_marketplace.wasm
fi

echo "Build complete!"
echo "  - gem_nft.wasm: $(du -h gem-nft/gem_nft.wasm | cut -f1)"
echo "  - gem_marketplace.wasm: $(du -h marketplace/gem_marketplace.wasm | cut -f1)"
