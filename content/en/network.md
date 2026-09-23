---
slug: network
title: TKMChain onion network
description: Tor-only peer networking, onion bootnodes, node operation, and network privacy on TKMChain.
kind: network
---

# An onion-only network path

TKMChain nodes use Tor onion services for peer discovery and transport. Onion-only mode keeps public IP addresses out of peer advertisements and rejects clearnet bootnodes.

[Read the Tor installation guide](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/TOR_INSTALLATION.md) · [Read privacy mode](https://github.com/tkmchain/go-tkmchain/blob/artartical/docs/PRIVACY_MODE.md)

## How a node connects

1. Tor runs a local SOCKS5 listener and publishes the node's onion service.
2. `bootnodes.go` supplies onion bootnodes with discovery disabled.
3. The node dials peers through Tor and advertises its onion hostname.
4. HTTP and WebSocket RPC stay on loopback for local wallets and tools.
5. Transaction propagation uses the configured Tor path and Dandelion-style stem handling where enabled.

## Safe node defaults

Keep `--http.addr=127.0.0.1` and `--ws.addr=127.0.0.1` unless an authenticated private reverse proxy is required. Set an onion hostname and SOCKS5 endpoint explicitly, and use `discport=0` for static onion bootnodes.

```text
./gtkm \
  --privacy.onion-only \
  --p2p.tor-socks5=socks5://127.0.0.1:9050 \
  --p2p.onion-hostname=<your-onion-hostname>.onion \
  --bootnodes='enode://<node-key>@<bootnode>.onion:3000?discport=0' \
  --http.addr=127.0.0.1 --ws.addr=127.0.0.1
```

The daemon can install or start Tor through the platform service manager when configured to do so. A missing onion hostname or unavailable proxy causes a clear startup error rather than silently falling back to a public IP.

## What Tor protects

Tor hides the direct network origin from peers and keeps node advertisements on onion names. It does not hide block contents, consensus-visible transaction hashes, timing from a global observer, or the endpoint where a wallet stores its keys.

## Mining and relays

Mining pools and Shield3 relays can expose onion endpoints. XMRig should connect through the local Tor SOCKS5 proxy when the pool publishes an onion hostname. Keep wallet-to-relay requests on Tor and use fixed request classes for batch privacy.
