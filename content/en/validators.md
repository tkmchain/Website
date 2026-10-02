---
slug: validators
title: TKMChain validator registration
description: Register, operate, exit, and verify an Antartical validator without trusting a private dashboard.
kind: governance
---

# Run a TKMChain validator

Antartical adds a consensus validator registry alongside RandomX mining. A
validator is an ML-DSA-87 account that locks a bond, signs the slot attestations
assigned to it, and receives one deterministic validator reward per block. The
registry is part of the state transition; it is not an EVM contract and cannot
be changed by an RPC administrator.

## Network and activation rules

- **Mainnet:** chain ID `8979`; Antartical activates at `2026-10-01 00:00 UTC`
  (Unix timestamp `1790812800`).
- **Egypt rehearsal:** chain ID `8980`; the post-fork rules are active from
  genesis so operators can rehearse the complete lifecycle before mainnet.
- **Account type:** ML-DSA-87 public key and a chain-bound PQ transaction.
  Legacy ECDSA accounts must migrate before they can register.
- **Capacity:** at most 4,096 registry records. The active set is derived from
  canonical state on every node.

Older nodes must not be used for an Antartical validator. Check the canonical
head and fork state first:

```sh
curl -s http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"tkmprotocol_antarticalStatus","params":[]}'

curl -s http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":2,"method":"tkmprotocol_antarticalFeatures","params":[]}'
```

These calls are read-only. A node must report the expected chain ID, canonical
head, and active validator feature before an operator signs a registration.

## Registration lifecycle

1. **Fund the signer.** The ML-DSA-87 sender needs at least **500,100 TKM**:
   500,000 TKM for the bond and 100 TKM for the registration burn. Keep extra
   TKM for the transaction fee.
2. **Create the envelope locally.** The transaction is type `PQTkmTxType`,
   targets the reserved Shielded Pool address, carries exactly 500,000 TKM,
   and uses the `TKMVALREG1` payload. The RLP payload contains the envelope
   version, the ML-DSA-87 public key, the reward address, and an activation
   height at least 720 blocks after the current block. The reward address must
   be the address derived from the same public key.
3. **Sign through the local wallet or IPC.** Private keys and passphrases stay
   on the signer. Never paste a PQ secret into a browser, pool, explorer, or
   relay. The node rejects a mismatched key, chain ID, target, value, or
   activation height before the transaction enters the pool.
4. **Wait for activation.** Consensus burns the 100 TKM fee and records the
   500,000 TKM bond in the state registry. The record is ineligible until its
   activation height; it cannot be selected early.
5. **Operate the slot.** Active records are sorted by address and selected by a
   stake-weighted, parent-hash-and-height-seeded choice. With the fixed bond,
   this produces a deterministic rotation that every node can recompute.

The registration payload and state encoding are defined in
[`core/validator_registry.go`](https://github.com/tkmchain/go-tkmchain/blob/v1.21.62/core/validator_registry.go).
Do not invent a different RLP layout or send a normal Ethereum transaction to
the pool address.

## Rewards and halving

At the start of the schedule each block carries **200 TKM** in protocol reward
shares:

| Recipient | Share |
| --- | ---: |
| RandomX miner | 90 TKM |
| Selected validator | 70 TKM |
| Rotating King | 35 TKM |
| Main King | 5 TKM |

The validator share is paid once to the validator selected for that block. The
existing halving interval applies to every share together, using integer wei
arithmetic. Reward markers are checked against the parent hash, selected
record, recipient, height, and halved amount; a block with a forged or missing
validator reward is invalid.

## Exit, withdrawal, and slashing

- **Voluntary exit:** sign a zero-value `PQTkmTxType` to the reserved pool with
  the `TKMVALEXIT1` payload. The record stops being selected at the exit
  height and starts the unbonding clock.
- **Bond withdrawal:** after **21,600 blocks**, sign a zero-value
  `TKMVALWD1` action. Consensus checks the registered public key and returns
  the 500,000 TKM bond to the validator reward address. A withdrawal before
  the deadline, from a different key, or twice is rejected.
- **Equivocation:** anyone can submit `TKMVSLASH1` evidence containing two
  ML-DSA-87 signatures from the same validator, at the same height, over
  different block hashes. Valid evidence burns the remaining bond, jails the
  record for the unbonding period, and is replay-protected by its evidence
  digest.

Reorganizations restore the registry and bond state with the canonical block;
replaying a registration, exit, withdrawal, reward marker, or slash evidence
cannot mint a second effect. Operators should keep the node database and the
canonical block source in sync when rehearsing a reorg.

## What an operator should monitor

Monitor the node's canonical head, peer health over onion transport, the
validator feature flags, and the reward marker in every block assigned to the
validator. The explorer's validator view must show the record's registration,
activation, exit, jail, and unbonding heights from canonical state. A missing
optional registry RPC means “unavailable”; it must never be displayed as an
empty or guessed validator set.

The validator registry is one part of the Antartical upgrade. Shield3/Shield4,
stamping, TKMNet/Tor-only transport, slot-level witnesses, and the versioned
asset and gas metadata follow the same activation boundary. Parallel contract
execution, enforced Verkle stateless sync, bundled Revm/evmone backends, and
byte-compatible EIP-4337/RIP-7560 remain explicitly gated until their
multi-node acceptance tests pass.
