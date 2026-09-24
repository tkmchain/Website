---
slug: privacy
title: TKMChain Shield3 privacy
description: How Shield3 encrypted notes, proofs, viewing keys, and relay payments protect transaction privacy.
kind: privacy
---

# Shield3 privacy

Shield3 is TKMChain's private transaction system. It lets consensus verify authorization, value conservation, ownership, and replay protection while payment details stay inside encrypted transaction records.

[Open the wallet](https://wallet.tkmchain.site) · [Read the protocol specification](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/SHIELD3_ANTARTICAL.md)

## What observers can see

The chain exposes the canonical transaction hash, block inclusion, gas fields, commitments, nullifiers, proof metadata, and the fields required to validate consensus. It does not expose plaintext payment amounts, recipient viewing keys, note openings, or message bodies.

## What Shield3 encrypts

- Note values and ownership information
- Recipient incoming and outgoing viewing material
- One-time output keys and encrypted payment tags
- Selective disclosure capsules addressed to an authorized viewer
- Private communication payloads carried by Phone and EmailVM

Each output uses fresh randomness and fixed-size encrypted records. An incoming viewing key can scan owned outputs. An outgoing viewing key can reveal payments made by a wallet. A stamp key reveals only the registered identity stamp. None of these keys authorizes spending.

## Proof and replay rules

Native Shield3 proofs bind the complete unsigned transaction intent: chain, nonce, gas, fee caps, target, encrypted outputs, commitments, nullifiers, input count, relay mode, expiry, and sponsorship fields. Changing a payment or fee invalidates the proof.

Nullifiers prevent a note from being spent twice. Consensus rejects malformed proofs, duplicate commitments, zero mix digests, invalid stamps, expired relay leases, and transactions that exceed the 5,000,000 TKM aggregate send limit.

## Relayed and sponsored sends

A wallet can prepare a payment without exposing its payer identity to an operator. The operator contributes its own post-quantum signature and broadcasts the durable signed bytes. Relay requests use exact bounded size classes, and retries return the same transaction bytes after a lost response.

The wallet validates the operator signature and every payer-bound field locally. A relay can submit a transaction; it cannot open notes, change the recipient, re-sign a different nonce, or spend a payer's funds.

## Selective disclosure

A payer can create a disclosure capsule for a bank, auditor, counterparty, or tax record. The capsule is addressed to the recipient's authorized disclosure key and binds the specific payment context. Sharing it reveals the chosen record without publishing a wallet-wide history.

## Limits and honest expectations

Shield3 protects data that remains encrypted and keys that remain secret. Endpoint malware, compromised browsers, leaked viewing keys, traffic analysis, and recipient-side disclosure remain practical considerations. Privacy design reduces public data exposure; it does not remove the need to secure devices and recovery material.
