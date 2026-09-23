---
slug: developers
title: Build on TKMChain
description: EVM, TVM, RPC, RandomX, Shield3, post-quantum accounts, and developer resources for TKMChain.
kind: developers
---

# Build on TKMChain

TKMChain keeps familiar EVM tools while adding native APIs for Shield3, post-quantum accounts, TVM, communications, mining, and governance.

[Open the explorer](https://block.tkmchain.site) · [Browse the source](https://github.com/tkmchain/go-tkmchain) · [Open the wallet](https://wallet.tkmchain.site)

## Network constants

- **Chain ID:** 8979
- **Currency:** TKM
- **Execution:** EVM-compatible transactions and deterministic TVM modules
- **Consensus:** RandomX proof of work with permanent finality through block 41913
- **Account signatures:** post-quantum ML-DSA-87
- **Private sends:** Shield3 native proof verifier and encrypted notes

## RPC namespaces

The daemon exposes standard `eth`, `net`, `web3`, and `admin` methods alongside TKM-specific namespaces for privacy, account registration, rotating kings, TVM, phone, governance, and RandomX status. Bind RPC to loopback and place authenticated access behind a private service when remote access is necessary.

## Shield3 integration

Use the wallet helpers to decode payment codes, build private batches, review relay offers, construct selective disclosures, and match an operator's exact signed bytes. Applications should never parse or manufacture private envelopes by hand.

## TVM and contracts

TVM modules must be deterministic across supported nodes. Avoid wall-clock time, filesystem access, network calls, floating-point ambiguity, unmanaged threads, and platform-specific assembly. Contract execution remains bounded by gas and consensus rules.

## Mining

RandomX is CPU-friendly proof of work. The official XMRig build includes TKM configuration examples and cross-platform release artifacts. Pool connections can use onion endpoints through Tor.

[Download builds](download.html) · [Read the XMRig guide](https://github.com/tkmchain/xmrig/blob/main/README.md)
