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

### Register a Rotating King

A funded ML-DSA-87 account can register itself from the interactive console
wallet. Start a node and run:

```text
./gtkm wallet interactive
```

Choose **Kings**, then press `r`. Select the local account, review the active
stake requirement and fee reserve, and type `REGISTER` to submit the local
`rk_add` request. The wallet signs through the node's IPC endpoint; it does not
send the account password or private key to the RPC server. Save the returned
registration hash for cross-node verification.

Use `s` to inspect one registration by local account number or address. The
status view includes the chain-bound registration hash, locked amount, added
height, unlock height, and whether the account is current or next. The Kings
screen also lists registrations and recent rotation history automatically. The same information
is available to operators through `rk_list`, `rk_status`, and
`rk_getKingStats`.

Before Antartical the legacy minimum stake is 50,000 TKM. At Antartical it is
100,000 TKM, plus the existing 1-TKM registration fee reserve. Egypt (chain
8980) runs the post-fork rule from genesis. A registration is an eligibility
record checked by consensus; it does not debit an account outside a block. If
the account later spends below the active requirement, it is pruned from the
rotation schedule.

## Checkpoints and the permanent boundary

The mainnet checkpoint boundary through block 41913 is permanent. Nodes reject a history that rolls back below that boundary or presents a mismatched checkpoint hash. This protects recovery, synchronization, and release builds from accepting an incompatible chain history.

## Append-only block-hash anchors

`TKMBlockHashAnchors` is an optional contract for operators that need an
event-indexed record of canonical block hashes. Its owner can call
`appendVerified(height, expectedHash)`, `appendCanonical(height)`,
`appendParent()`, or `appendVerifiedRange(...)`. Before each value is stored,
the contract compares it with the EVM `BLOCKHASH` result. Anchors are
contiguous after the first entry, and there is no delete, overwrite, upgrade,
or self-destruct path. A domain-separated rolling commitment covers the full
sequence, while `BlockHashAnchored` events can be checked by explorers and
independent nodes.

All append methods activate at Antartical: mainnet chain 8979 uses 1 October
2026 00:00 UTC (`1790812800`), while Egypt chain 8980 is active from genesis.
Unknown chain IDs remain disabled.

The EVM can only verify the previous 256 blocks. The contract therefore rejects
older hashes instead of trusting an owner-supplied historical list. To anchor
from block 1, deploy at genesis and append continuously, or add a consensus
historical-hash oracle with a verified header proof. The contract detects a
conflicting canonical hash; it does not itself prevent a reorganization, so
nodes must continue enforcing TKMChain checkpoints and finality rules.

## Antartical activation

Hardfork rules are activated from the configured chain timestamp and height. Nodes validate the activation state before accepting Shield3, stamping, sponsorship, and post-quantum account features. A release must report the same chain configuration as its peers.

## Sponsorship

Sponsorship lets a registered operator pay execution fees for a bounded private operation. The authorization commits to the chain, operator, nonce, gas, expiry, beneficiary, stamp, encrypted outputs, and proof. Operators can submit a payment but cannot alter its private recipients or open its notes.

## Address votes and investigations

After Antartical, a stamped account can submit a public address-vote envelope with a bounded reason such as `fraud`. Each registered stamp owner gets one active vote per target, even when that owner controls multiple addresses. Fifteen distinct active stamp owners suspend the target from sending or spending. The target is not erased and its history is not rewritten.

Every vote and unvote burns 50 TKM from the stamped voter. The envelope still carries zero transaction value and the burn is destroyed by consensus, so it is never credited to the target, a treasury, or another account. The voter must fund gas and this burn separately.

The voter can later submit `gtkm governance unvote --from <stamped-address> --address <target>` to remove its own vote. When the count drops below fifteen, consensus clears the suspension marker. Use `gtkm governance status --address <target>` or `tkmgov_getAddressVoteStatus` to inspect the canonical count. Reasons are carried by signed transactions so investigators can review them; a vote is an allegation, not a finding of guilt.

Each node also maintains a block-derived audit projection at `~/.tkmchain/gtkm/governance/address-votes.json`. It records vote reasons, voters, target addresses, transaction hashes, and block references. The file is rebuilt from canonical blocks after restart or reorganization and cannot override consensus state; deleting it is safe.

## Operating a verifier

Run a full node with the published chain configuration, keep the database backed up, and compare checkpoint and activation logs with another independent node. Governance data is useful only when its signatures, timestamps, and state transitions are verified locally.
