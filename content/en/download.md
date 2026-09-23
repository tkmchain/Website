---
slug: download
title: TKMChain downloads
description: Download the TKMChain wallet, node, Android wallet, and RandomX miner builds.
kind: standard
---

# Download TKMChain

Choose the build for your operating system. Verify release checksums before running a node or miner, and use the Tor-only startup instructions when connecting to mainnet.

## Wallet and node

- [Linux x86-64](download/linux-amd64.tar.gz)
- [Linux ARM64](download/linux-arm64.tar.gz)
- [Windows x86-64](download/windows-amd64.zip)
- [macOS Intel](download/darwin-amd64.tar.gz)
- [macOS Apple Silicon](download/darwin-arm64.tar.gz)
- [Android wallet](download/app-release.apk)

## RandomX miners

- [XMRig for Ubuntu x86-64](download/xmrig-ubuntu-amd64.tar.gz)
- [Windows miner](download/gtkm-windows-amd64.zip)

The miner connects to the configured TKM pool through Tor. Keep the supplied `config.json` beside the executable and follow the [XMRig mining guide](https://github.com/tkmchain/xmrig/blob/main/README.md).

## Run a Tor-only node

Install Tor for your operating system, start the service, and use an onion hostname in `--bootnodes`. Keep HTTP and WebSocket RPC bound to loopback unless a separate authenticated reverse proxy is required.

[Read the Tor installation guide](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/TOR_INSTALLATION.md) · [Read the node privacy guide](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/PRIVACY_MODE.md)

## Release source

All release builds are produced by GitHub Actions from signed version tags. Review the [release workflow](https://github.com/tkmchain/go-tkmchain/blob/artartical/.github/workflows/release.yml) and [source repository](https://github.com/tkmchain/go-tkmchain).
