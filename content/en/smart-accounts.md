---
slug: smart-accounts
title: TKMChain Smart Accounts
description: Smart account controls for multisignature approval, spending limits, recovery, sessions, and sponsorship.
kind: standard
---

# Wallet security that can enforce rules

TKMChain smart accounts add multisignature approvals, spending limits, restricted session keys, delayed recovery, deterministic account creation, and application-sponsored transactions while staying compatible with the network's existing contract execution.

## Implementation status

- **Implementation:** contracts, RPC helpers, and CLI support
- **Consensus change:** none
- **Hardfork required:** no
- **On-chain deployment:** publish and verify before production use
- **Signing custody:** user-controlled

## Programmable protection for everyday accounts

A smart account holds TKM and calls contracts like a normal account, but authorization is enforced by transparent contract rules instead of relying on one unrestricted key.

### Multisignature owners

Require several independently secured owners for high-value transfers and sensitive policy changes.

### Spending limits

Set a daily native-TKM limit and a high-value threshold that activates stronger signature requirements.

### Restricted session keys

Authorize one target, function selector, time window, per-call value, and total value without exposing the primary owner key.

### Delayed guardians

Recover lost access through a guardian threshold and mandatory delay, while existing owners retain time to cancel an attack.

### Sponsored operations

Allow an application sponsor to approve short-lived operations for specific contract functions without gaining custody of user funds.

### Deterministic addresses

Calculate an account address before deployment through the factory's CREATE2 account creation process.

## How an operation moves

1. **Build:** a wallet constructs calldata and a chain-bound operation hash.
2. **Authorize:** owners or a narrowly restricted session key sign the operation.
3. **Relay:** a user or application relayer submits the signed operation as a normal contract transaction.
4. **Enforce:** the account checks nonce, expiry, signatures, limits, sessions, and lock state.
5. **Execute:** the account transfers TKM or calls the chosen contract atomically.

## No protocol privilege

The smart-account system does not create a master recovery key or special consensus authority. Main King, Rotating Kings, node operators, institutions, and EmailVM mailbox owners cannot bypass account signatures or seize funds.

[Open the wallet](https://wallet.tkmchain.site) · [Read the implementation](https://github.com/tkmchain/go-tkmchain/tree/artartical/internal/smartaccount)
