---
slug: index
title: TKMChain — Private programmable money
description: TKMChain is a privacy-focused EVM blockchain with Shield3 private transactions, Tor networking, post-quantum accounts, encrypted communications, and RandomX mining.
kind: home
---

# Private, programmable **money.**

TKMChain is an EVM-compatible network for people who want useful digital money without publishing every amount, relationship, and conversation to the world.

[Get started](https://wallet.tkmchain.site) [Understand Shield3](privacy.html)

## Network at a glance

- **Shield3:** proof-checked private transactions
- **Tor:** onion-only peer networking
- **Post-quantum accounts:** ML-DSA-87 signatures
- **Runtime:** EVM, TVM, and RandomX proof of work
- **Communications:** TKM Phone and EmailVM
- **Network anchor:** finality through block 41913

## Privacy is part of settlement

Shield3 lets the network verify authorization, balance, and replay protection without publishing plaintext amounts and recipients to every observer.

### Shield3 private transactions

Shield3 uses encrypted notes, one-time output keys, proof-bound intents, and nullifiers. Multiple private inputs are supported, while consensus enforces bounded resources and a 5,000,000 TKM operation limit.

Viewing and payment disclosure keys let you share one payment or a scoped history with a bank, auditor, or counterparty when you choose. The public chain still exposes fields required for consensus, such as hashes, commitments, nullifiers, gas, and block inclusion.

[Open the wallet](https://wallet.tkmchain.site) · [Explore the Shield3 page](privacy.html)

## A more private network path

Onion-only mode routes configured peer traffic through Tor, disables clearnet discovery and NAT advertising, and publishes an onion hostname instead of a public IP. Nodes refuse unsafe startup when the onion configuration is incomplete.

Tor reduces direct network-origin exposure; it does not erase timing or endpoint metadata. Local wallet and prover calls stay on loopback so private keys and proof material do not travel over the network.

[Explore the Tor network](network.html) · [Read privacy mode](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/PRIVACY_MODE.md)

## Money, identity, and messages

TKM Phone and EmailVM make encrypted communications network-aware without putting plaintext conversations on-chain.

TKM Phone records number ownership, device authorization, encrypted messages, and call signaling through the daemon. EmailVM binds domains and mailboxes to canonical chain state and encrypts messages for published mailbox keys.

The chain can verify that an action was authorized and paid without receiving the message body, private key, or audio. Your endpoint still matters: protect your device, browser, recovery material, and recipient access.

[Explore Phone and EmailVM](communications.html) · [Read phone documentation](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/tkmphone.md)

## Build on familiar EVM rails

Use standard wallets and RPC where compatibility helps. Use TKM-specific APIs for privacy, post-quantum accounts, TVM, communications, mining, and governance.

### RandomX mining

CPU-friendly proof of work with official miners and onion pool support. [Download miners](download.html)

### EVM and TVM

Ethereum-compatible contracts plus bounded deterministic native modules. [Explore developer tools](developers.html)

### Verifiable governance

Rotating Kings, signed disclosures, checkpoints, and a permanent block-41913 boundary. [Explore governance](governance.html)

## Start with the tool you need

Open the wallet, inspect the chain, connect through Tor, or download a TKM-compatible RandomX miner.

[Wallet](https://wallet.tkmchain.site) [Explorer](https://block.tkmchain.site) [Downloads](download.html)
