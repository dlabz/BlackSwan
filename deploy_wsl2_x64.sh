#!/usr/bin/env bash
# WSL2 x64 Auto-Deploy Oneliner for SWAN 35b Phase Engine
# Mounts /mnt/swan_codebooks tmpfs (2GB LPDDR4/RAM allocation) and fires up swan_rail_v2.mjs

sudo mkdir -p /mnt/swan_codebooks && \
sudo mount -t tmpfs -o size=2G tmpfs /mnt/swan_codebooks 2>/dev/null || true && \
node swan_rail_v2.mjs
