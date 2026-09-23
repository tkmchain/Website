---
slug: governance
title: TKMChain governance and finality
description: Rotating Kings, checkpoints, sponsorship, hardfork activation, and permanent network boundaries.
kind: governance
---

# Verifiable governance

TKMChain governance is represented by explicit chain state, signed authorizations, checkpoints, and activation rules. Node operators can verify the same state instead of trusting a dashboard or a private administrator.

[Open the explorer](https://block.tkmchain.site) · [Read the protocol source](https://github.com/tkmchain/go-tkmchain)

## Main King and Rotating Kings

The chain configuration identifies the Main King and any active Rotating King set. Rotations occur on a defined interval and are validated by consensus. These roles authorize protocol operations; they do not hold user spending keys or bypass Shield3 proof checks.

## Checkpoints and the permanent boundary

The mainnet checkpoint boundary through block 41913 is permanent. Nodes reject a history that rolls back below that boundary or presents a mismatched checkpoint hash. This protects recovery, synchronization, and release builds from accepting an incompatible chain history.

## Antartical activation

Hardfork rules are activated from the configured chain timestamp and height. Nodes validate the activation state before accepting Shield3, stamping, sponsorship, and post-quantum account features. A release must report the same chain configuration as its peers.

## Sponsorship

Sponsorship lets a registered operator pay execution fees for a bounded private operation. The authorization commits to the chain, operator, nonce, gas, expiry, beneficiary, stamp, encrypted outputs, and proof. Operators can submit a payment but cannot alter its private recipients or open its notes.

## Operating a verifier

Run a full node with the published chain configuration, keep the database backed up, and compare checkpoint and activation logs with another independent node. Governance data is useful only when its signatures, timestamps, and state transitions are verified locally.
