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

## Address votes and investigations

After Antartical, a stamped account can submit a public address-vote envelope with a bounded reason such as `fraud`. Each registered stamp owner gets one active vote per target, even when that owner controls multiple addresses. Fifteen distinct active stamp owners suspend the target from sending or spending. The target is not erased and its history is not rewritten.

The voter can later submit `gtkm governance unvote --from <stamped-address> --address <target>` to remove its own vote. When the count drops below fifteen, consensus clears the suspension marker. Use `gtkm governance status --address <target>` or `tkmgov_getAddressVoteStatus` to inspect the canonical count. Reasons are carried by signed transactions so investigators can review them; a vote is an allegation, not a finding of guilt.

Each node also maintains a block-derived audit projection at `~/.tkmchain/gtkm/governance/address-votes.json`. It records vote reasons, voters, target addresses, transaction hashes, and block references. The file is rebuilt from canonical blocks after restart or reorganization and cannot override consensus state; deleting it is safe.

## Operating a verifier

Run a full node with the published chain configuration, keep the database backed up, and compare checkpoint and activation logs with another independent node. Governance data is useful only when its signatures, timestamps, and state transitions are verified locally.
