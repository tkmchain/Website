---
slug: evm
title: The TKM EVM profile
description: How TKM stays EVM-compatible while adding a chain-native asset identity, privacy, transport, and execution profile.
kind: developers
---

# The TKM EVM profile

TKM keeps the EVM instruction and ABI surface so existing Solidity, Vyper, Rust EVM, wallet, and indexer tools can work. It is not accurate to promise that a system is both byte-for-byte Ethereum-compatible and 100% different from Ethereum. TKM's approach is a layered profile: familiar execution at the contract boundary, with TKM-native consensus, privacy, transport, account policy, and asset identity around it.

## What is TKM-native

- **RandomX consensus:** CPU-friendly sealing, TKM seed epochs, difficulty, shares, and reward accounting.
- **Post-quantum accounts and private envelopes:** ML-DSA migration plus Shield3 and Shield4 encrypted notes, nullifiers, one-time outputs, and proof-checked value conservation.
- **Stamped accounts:** a name and country registration is a protocol record revealed only with the stamp key; spending policy can require a confirmed stamp.
- **Onion-only transport:** Tor and TKMNet routes for peers, pool traffic, wallets, Phone, and EmailVM.
- **TVM:** bounded deterministic native modules behind a fork-gated precompile.
- **Address governance:** signed vote and unvote actions, a fifteen-vote suspension threshold, and a 50 TKM burn for each action.
- **TKM asset identity:** an immutable `TKMASSET` runtime trailer and a domain-separated asset ID that wallets and explorers can verify.

These layers do not silently change an ordinary ERC contract. A contract becomes TKM-native when its runtime code carries a valid manifest for the active chain.

## TKM asset kinds

- **TKM-20:** fungible balances.
- **TKM-721:** non-fungible token IDs with zero decimals.
- **TKM-6909:** multiple fungible token IDs in one contract.

Capability flags tell a wallet what to review before signing: mintable, burnable, pausable, permit, batch transfer, shielded balances, royalties, soulbound, and upgradeable. Flags are declarations; contract authorization and the policy hash remain authoritative.

## Antartical execution profile

The Antartical profile makes these declarations executable and binds them to
the network:

`params.Rules.TKMProfileVersion` is `0` before Antartical and `1` at or after
the fork. Egypt uses version `1` from genesis. Versioned helpers reject new
metadata before activation, while the historical receipt and witness
encodings remain available for replay.

- **Typed transaction domains:** signatures commit to chain ID, receiving
  contract, operation type, and payload. ML-DSA-87 public keys are checked
  against the post-quantum sender address.
- **Native token policy:** a canonical policy commitment binds the manifest's
  flags and policy hash. The state machine enforces mint, burn, pause,
  unpause, maximum supply, royalty, and shielded capability rules.
- **Asset registry root:** sorted asset records (asset ID, manifest hash, and
  runtime hash) produce a deterministic registry commitment carried in a
  versioned header-extra suffix for stateless clients.
- **Shielded assets:** Shield3 and Shield4 nullifier bindings include the
  chain, asset ID, token ID, and nullifier, preventing cross-token proof reuse.
- **Four gas dimensions:** EVM, TVM, proof verification, and blob work are
  metered independently with overflow rejection.
- **Parallel execution transcript:** deterministic access-set waves are
  committed to receipt-index metadata. Legacy receipt RLP remains unchanged
  until a coordinated receipt-format upgrade.
- **Stateless light clients:** canonical sorted witness commitments can be
  checked together with a quorum finality certificate without a full state
  database.
- **Alternate EVMs:** Revm, evmone, or another backend must pass differential
  vectors against the canonical interpreter before registration.

## Egypt EUSD test token

The repository includes [`contracts/egypt/EUSD.sol`](https://github.com/tkmchain/go-tkmchain/blob/v1.21.62/contracts/egypt/EUSD.sol), a six-decimal issuer-minted `TKM-20` test token. The Egypt rehearsal uses chain ID 8980, mints 1,000 EUSD, transfers 250 EUSD, verifies the 750/250 balances and unchanged supply, parses the runtime trailer, and checks that the direct asset ID equals the Antartical-gated `0x...f3` precompile result.

Run the deterministic in-memory rehearsal from the repository root:

```bash
go run ./cmd/egypt-contract-test
```

For a daemon-backed Egypt node, keep its database separate from production:

```bash
./scripts/run-egypt.sh --port 3001 \
  --http --http.addr 127.0.0.1 --http.port 8645 \
  --http.api eth,net,web3,tkmasset,tkmprivacy,randomx \
  --http.vhosts localhost
```

The launcher defaults to `~/.tkmchain-egypt` and refuses to run with the
production `~/.tkmchain` path.

## Build the manifest

Add `tkmasset` to the node's `--http.api` list, then ask the node for canonical bytes and a runtime trailer. `0x2313` is TKM mainnet (8979); Egypt is `0x2314` (8980).

```bash
curl -s http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{
    "jsonrpc":"2.0", "id":1,
    "method":"tkmasset_buildManifest",
    "params":[{
      "chainId":"0x2313",
      "kind":"fungible",
      "decimals":18,
      "flags":9,
      "policyHash":"0x0000000000000000000000000000000000000000000000000000000000000000",
      "name":"TKM Dollar",
      "symbol":"TKMD",
      "metadataURI":"ipfs://tkm/asset.json"
    }]
  }'
```

Append the returned `runtimeTrailer` to the compiled **runtime** bytecode before deployment. Do not append it to constructor/init code. The manifest commits to the chain ID, kind, decimals, capability flags, policy hash, name, symbol, and metadata URI.

## Classify a contract

Use the chain-level classifier instead of trusting `symbol()`, `name()`, or a claimed contract method:

```bash
curl -s http://127.0.0.1:8545 \
  -H 'content-type: application/json' \
  --data '{
    "jsonrpc":"2.0", "id":2,
    "method":"tkmasset_getAsset",
    "params":["0x43aeb055883863cfe40804e386bec801b4ca63ec", "latest"]
  }'
```

A native response contains `native: true`, `network: "tkm"`, a `standard`, `manifestHash`, `assetId`, policy hash, capabilities, and runtime code hash. A regular ERC contract returns successfully as `native: false`, `network: "ethereum-compatible"`. A manifest for the wrong chain is also untrusted and is never assigned a native asset ID.

## The precompile and Solidity helper

After the TKM Cancun/Antartical gate, `0x00000000000000000000000000000000000000f3` accepts exactly 85 bytes: a 32-byte chain ID, 20-byte contract address, one-byte kind, and 32-byte manifest hash. It returns the 32-byte asset ID without reading state.

```solidity
bytes32 id = TKMAssetIdentity.compute(
    bytes32(uint256(block.chainid)),
    address(this),
    1,             // TKM-20
    manifestHash
);
```

The helper is in [`contracts/tkm/TKMAsset.sol`](https://github.com/tkmchain/go-tkmchain/blob/v1.21.62/contracts/tkm/TKMAsset.sol). The precompile is fork-gated, so deployment tools must handle it being unavailable before Antartical.

## A safe deployment flow

1. Write and publish the token policy.
2. Choose `TKM-20`, `TKM-721`, or `TKM-6909` and set the capability flags.
3. Build the canonical manifest and append its trailer to runtime code.
4. Deploy with the normal EVM transaction path.
5. Query `tkmasset_getAsset` at the deployment block and current head.
6. Cache the chain ID, contract, kind, manifest hash, and runtime code hash together.
7. Require the sender and recipient's stamped status for private or policy-gated transfers.

Read the full implementation reference in [`TKM_EVM_UNIQUENESS.md`](https://github.com/tkmchain/go-tkmchain/blob/v1.21.62/docs/TKM_EVM_UNIQUENESS.md).
