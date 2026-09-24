---
slug: communications
title: TKM Phone and EmailVM
description: Encrypted communications, phone ownership, mailbox identity, and device authorization on TKMChain.
kind: communications
---

# Communications with verifiable ownership

TKM Phone and EmailVM extend TKMChain with private communication services. The chain records ownership and authorization proofs while message bodies, calls, and mailbox content remain encrypted for their intended keys.

[Open EmailVM](https://wallet.tkmchain.site/mail/) · [Read Phone documentation](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/tkmphone.md)

## TKM Phone

Phone numbers are purchased from available buckets and registered to a stamped TKM address. The wallet can show whether an address owns a number, register a device, authorize a new device, and send encrypted messages without entering a number first.

The daemon verifies ownership, device authorization, call signaling permissions, and payment. It never needs the plaintext message or call audio to enforce those rules.

## EmailVM

EmailVM binds domains and mailboxes to canonical chain state. A mailbox publishes the key material needed to receive encrypted mail; the owner controls the keys that open messages and authorize mailbox actions.

Mailbox registration, renewals, aliases, and transfers are ordinary chain operations. Message payloads are encrypted before submission and are not used as public contract data.

## Identity and disclosure

A stamped address can prove a registered name and country through its stamp key without exposing unrelated wallet history. Disclosure is scoped to the requested record. Device keys and mailbox keys can be rotated without handing custody to node operators or rotating kings.

## Safety model

Protect device keys, recovery material, browser extensions, and viewing keys. Communication privacy depends on endpoint security and recipient behavior as well as encrypted transport.
