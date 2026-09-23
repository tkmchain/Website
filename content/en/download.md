---
slug: download
title: TKMChain downloads
description: Download the TKMChain wallet, node, Android wallet, and RandomX miner builds.
kind: standard
---

# Download TKMChain

Current TKMChain release: **{{TKM_VERSION}}**. Choose a build for your operating system, then verify the release checksums before running a node or miner. Use the Tor-only startup instructions when connecting to mainnet.

## Wallet and node

- [Linux x86-64 ({{TKM_VERSION}})]({{TKM_LINUX_AMD64}})
- [Linux ARM64 ({{TKM_VERSION}})]({{TKM_LINUX_ARM64}})
- [Windows x86-64 ({{TKM_VERSION}})]({{TKM_WINDOWS_AMD64}})
- [macOS Intel ({{TKM_VERSION}})]({{TKM_MACOS_AMD64}})
- [macOS Apple Silicon ({{TKM_VERSION}})]({{TKM_MACOS_ARM64}})
- [Android wallet ({{TKM_VERSION}})]({{TKM_ANDROID}})

[View all TKMChain {{TKM_VERSION}} release contents]({{TKM_RELEASE_URL}})

## XMRig miner

Current TKM-compatible XMRig release: **{{XMRIG_VERSION}}**. These packages include the TKM pool configuration and are built for the supported CPU targets.

- [Linux x86-64 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_X64}})
- [Linux ARM64 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_ARM64}})
- [Linux ARMv7 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_ARMV7}})
- [Windows x86-64 ({{XMRIG_VERSION}})]({{XMRIG_WINDOWS_X64}})

[View all XMRig {{XMRIG_VERSION}} release contents]({{XMRIG_RELEASE_URL}})

The miner connects to the configured TKM pool through Tor. Keep the supplied `config.json` beside the executable and follow the [XMRig mining guide](https://github.com/tkmchain/xmrig/blob/main/README.md).

## Run a Tor-only node

Install Tor for your operating system, start the service, and use an onion hostname in `--bootnodes`. Keep HTTP and WebSocket RPC bound to loopback unless a separate authenticated reverse proxy is required.

[Read the Tor installation guide](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/TOR_INSTALLATION.md) · [Read the node privacy guide](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/PRIVACY_MODE.md)

## Release source

All release builds are produced by GitHub Actions from signed version tags. Review the [release workflow](https://github.com/tkmchain/go-tkmchain/blob/artartical/.github/workflows/release.yml) and [source repository](https://github.com/tkmchain/go-tkmchain).
