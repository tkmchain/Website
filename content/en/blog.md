---
slug: blog
title: TKMChain field notes
description: Practical guides and release notes for private payments, stamps, Tor, wallets, mining, and address governance.
kind: blog
---

# TKMChain field notes

This is the working guide for the network. It explains what is shipping, how to use it, and where a node operator can verify the behavior in source and consensus state. The English Markdown is the canonical copy; the site build publishes it under every language route while reviewed translations are added to each catalog.

## What we are building

- **Antartical:** the protocol boundary for stamped accounts, post-quantum transaction envelopes, and the Shield3/Shield4 private execution rules.
- **Shield3 and Shield4:** encrypted notes, one-time outputs, nullifiers, proof-checked value conservation, selective disclosure, and asset-specific replay protection. The public chain still exposes the data needed to verify consensus; it does not publish note openings or plaintext payment values.
- **Tor-only transport and TKMNet:** onion peer discovery, relay paths, pool traffic, wallet RPC separation, and encrypted Phone and EmailVM messages. Keep local RPC bound to localhost and use an onion service for peer traffic.
- **Stamps:** a registered name and country label is committed to an address before it can send or receive a value transfer after Antartical. The stamp key reveals the label; it is not a spending key.
- **Wallets and bootstrap:** the desktop, Android, console wallet, explorer, and XMRig releases use the configured release manifest. A bootstrap replaces local chain data only after the wallet confirms the download and asks you to restart.
- **Stateless and execution work:** Verkle/stateless state transitions, deterministic gas checks, alternate EVM experiments, private TVM assets, and post-quantum account migration are developed behind explicit fork and test gates.

## Stamp an address before using it

1. Create or import an ML-DSA-87 account in the wallet. Legacy ECDSA accounts must migrate before they can use post-quantum private flows.
2. Open **Stamp address** (or the console wallet's stamp flow) and enter the name and country you want committed to the address.
3. Review the registration transaction. It is a zero-value protocol transaction to the reserved Shielded Pool address and is verified by consensus.
4. Wait for confirmation, then check the address status in the wallet or explorer. Do not delete the stamp key: it is the only way to reveal the label later.

An address with no confirmed stamp cannot send a value transfer or a Shield3/Shield4 withdrawal after Antartical. A recipient must also be stamped. Stamps are immutable registrations; choose the label carefully.

## Transfer TKM privately

1. Confirm that the sender and recipient both show a confirmed stamp.
2. Select **Shield3** or **Shield4** in the wallet and choose the recipient's private payment key. Shield4 is intended for the newer multi-input and link-tag flow.
3. Choose the asset and amount, review the fee and the 5,000,000 TKM aggregate send limit, and create the proof locally. Never paste an owner secret into a relay or web form.
4. Submit the signed bytes through the wallet's onion relay or your local node. A relay can forward a transaction but cannot open notes or change its recipient, amount, nonce, or proof context.
5. Keep the transaction hash for delivery tracking. Use the incoming viewing key to scan received notes, the outgoing viewing key to disclose payments you made, and a disclosure capsule when an auditor or bank needs one payment record.

Transparent EVM/TVM transfers are disabled after Antartical. A transaction that is not a valid post-quantum private envelope, stamp registration, or other consensus protocol envelope is rejected by both the mempool and block execution.

## Vote on a suspicious address

Address voting is a consensus-governed, public investigation signal. It is not proof that a theft occurred, and it does not give voters access to funds.

```text
gtkm governance vote --from 0xYOUR_STAMPED_ADDRESS --address 0xTARGET --reason fraud
gtkm governance unvote --from 0xYOUR_STAMPED_ADDRESS --address 0xTARGET
gtkm governance status --address 0xTARGET
```

The command signs a post-quantum protocol transaction locally. The voter must have a confirmed stamp. Each stamp owner can cast one vote for a target, even if that owner controls several addresses. The reason is bounded and recorded in the signed transaction for public review. Fifteen distinct active stamp owners suspend the target from sending and spending. A voter can remove only its own vote; when the count falls below fifteen, the suspension marker clears. Every vote and unvote burns 50 TKM from the stamped voter; the transaction value remains zero and the amount is destroyed by consensus. The voter must fund gas and the burn separately. Existing canonical history is never rewritten.

Investigators should publish evidence, allow the address owner to respond, and ask voters to unvote after a clean review. Operators can query `tkmgov_getAddressVoteStatus` to see the active count, threshold, and suspension marker at the canonical head.

## Run a node through Tor

Install Tor for your operating system, create an onion service for the P2P port, and start `gtkm` with onion-only networking. Keep HTTP and WebSocket RPC on `127.0.0.1`; applications such as the wallet, explorer, and pool should reach them locally or through an authenticated onion reverse proxy.

```text
./gtkm --privacy.onion-only \
  --p2p.tor-socks5=socks5://127.0.0.1:9050 \
  --p2p.onion-hostname=YOUR_NODE.onion \
  --bootnodes='enode://NODE_ID@PEER.onion:3000?discport=0' \
  --http --http.addr=127.0.0.1 --http.port=8545 \
  --ws --ws.addr=127.0.0.1 --ws.port=8546
```

Check the startup line for an onion hostname rather than `127.0.0.1`, and check the peer count after the node has had time to establish circuits. If the node data directory is already in use, stop the existing `gtkm` process before starting another one.

## Mine with XMRig

Use the XMRig release that matches your CPU and point it at the onion pool endpoint. Copy the TKM algorithm, wallet address, and worker name into `config.json`; do not put a private seed in the miner configuration.

```json
{
  "autosave": true,
  "pools": [{
    "url": "YOUR_POOL.onion:33330",
    "user": "YOUR_STAMPED_PQ_ADDRESS",
    "pass": "worker-1",
    "coin": "TKM",
    "daemon": false,
    "tls": true
  }]
}
```

The pool difficulty is a share target, not a promise of a block. A rejected share should include the pool's verification reason; `RandomX hash mismatch` means the pool and miner disagree about the job and must be fixed before mining continues.

## Wallet, Phone, and EmailVM

The interactive wallet connects to the local IPC endpoint and signs locally. It can show stamped identities, buy an available phone number, register a PQ device, send encrypted messages, inspect an address vote status, and migrate an ECDSA account to ML-DSA-87. Android first establishes a Tor connection, then starts the embedded node; if bootstrap installation replaces data, restart only after the app requests it.

Phone numbers and mailboxes are address-owned records. A lookup can show whether an address has a number or mailbox without requiring the user to know the number first. Message bodies and device keys are encrypted; availability, ownership, and protocol state remain verifiable chain data.

## Operator checklist

- Back up the keystore, PQ seed, stamp key, and viewing keys separately.
- Verify the chain ID, Antartical activation timestamp, checkpoint boundary, and current release before joining peers.
- Keep the node, wallet, pool, and explorer on compatible releases; a stale node can report missing historical state or lose peers while it catches up.
- Bind public RPC to localhost unless an authenticated onion proxy is required.
- Treat hashes, vote reasons, checkpoints, and receipts as public audit data. Treat note openings, owner secrets, viewing keys, and message bodies as confidential.
