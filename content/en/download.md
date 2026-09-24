---
slug: download
title: TKMChain downloads
description: Download the TKMChain wallet, node, Android wallet, and RandomX miner builds.
kind: standard
---

# Download TKMChain

Current TKMChain release: **{{TKM_VERSION}}**. Choose a build for your operating system, then verify the release checksums before running a node or miner. Use the Tor-only startup instructions when connecting to mainnet.

## Wallet and node

- [Linux x86-64 ({{TKM_VERSION}})]({{TKM_LINUX_AMD64}})
- [Windows node ({{TKM_VERSION}})]({{TKM_WINDOWS}})
- [Windows GUI wallet ({{TKM_VERSION}})]({{TKM_WINDOWS_WALLET}})
- [macOS release ({{TKM_VERSION}})]({{TKM_MACOS}})
- [Android wallet ({{TKM_VERSION}})]({{TKM_ANDROID}})

[View all TKMChain {{TKM_VERSION}} release contents]({{TKM_RELEASE_URL}})

## Fast bootstrap

Download the official current-chain archive through Tor, then let `gtkm` verify
and import it in batches. The archive is retained under the node's
`~/.tkmchain/gtkm/bootstrap/` directory on Linux (and the equivalent Tkmchain
directory on Windows):

[Download the official TKMChain bootstrap archive]({{TKM_BOOTSTRAP_URL}})

```bash
./build/bin/gtkm bootstrap \
  --url '{{TKM_BOOTSTRAP_URL}}' \
  --sha256 '{{TKM_BOOTSTRAP_SHA256}}' \
  --datadir "$HOME/.tkmchain"
```

Stop any running node before importing. The published SHA-256 is
`{{TKM_BOOTSTRAP_SHA256}}`. For a custom mirror, replace `--url` and provide its
matching `--sha256` value.

## XMRig miner

Current TKM-compatible XMRig release: **{{XMRIG_VERSION}}**. These packages include the TKM pool configuration and are built for the supported CPU targets.

- [Linux x86 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_X86}})
- [Linux x86-64 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_X64}})
- [Linux ARMv7 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_ARMV7}})
- [Linux ARM64 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_ARMV8}})
- [Linux RISC-V 64 ({{XMRIG_VERSION}})]({{XMRIG_LINUX_RISCV64}})
- [Windows x86 ({{XMRIG_VERSION}})]({{XMRIG_WINDOWS_X86}})
- [Windows x86-64 ({{XMRIG_VERSION}})]({{XMRIG_WINDOWS_X64}})
- [macOS Intel ({{XMRIG_VERSION}})]({{XMRIG_MACOS_X64}})
- [macOS ARM64 ({{XMRIG_VERSION}})]({{XMRIG_MACOS_ARMV8}})
- [Android x86 ({{XMRIG_VERSION}})]({{XMRIG_ANDROID_X86}})
- [Android x86-64 ({{XMRIG_VERSION}})]({{XMRIG_ANDROID_X64}})
- [Android ARMv7 ({{XMRIG_VERSION}})]({{XMRIG_ANDROID_ARMV7}})
- [Android ARM64 ({{XMRIG_VERSION}})]({{XMRIG_ANDROID_ARMV8}})

[View all XMRig {{XMRIG_VERSION}} release contents]({{XMRIG_RELEASE_URL}})

The miner connects to the configured TKM pool through Tor. Keep the supplied `config.json` beside the executable and follow the [XMRig mining guide](https://github.com/tkmchain/xmrig/blob/main/README.md).

## Run a Tor-only node

Install Tor for your operating system, start the service, and use an onion hostname in `--bootnodes`. Keep HTTP and WebSocket RPC bound to loopback unless a separate authenticated reverse proxy is required.

[Read the Tor installation guide](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/TOR_INSTALLATION.md) · [Read the node privacy guide](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/PRIVACY_MODE.md)

## Release source

All release builds are produced by GitHub Actions from signed version tags. Review the [release workflow](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/.github/workflows/release.yml) and [source repository](https://github.com/tkmchain/go-tkmchain).

## Debian and Ubuntu (APT)

The `tkmchain` Debian package installs `gtkm`, the `tkmchain` command
alias, and the Shield3 payout prover when it is included in the release. It
supports `amd64`, `arm64`, and `armhf`.

Direct package downloads:

- [APT package for Linux x86-64 ({{TKM_VERSION}})]({{TKM_DEB_AMD64}})
- [APT package for Linux ARM64 ({{TKM_VERSION}})]({{TKM_DEB_ARM64}})
- [APT package for Linux ARMv7 ({{TKM_VERSION}})]({{TKM_DEB_ARMHF}})

Install the package that matches `dpkg --print-architecture`:

```bash
set -eu

version="${TKM_VERSION:-{{TKM_VERSION}}}"
arch="$(dpkg --print-architecture)"
case "$arch" in amd64|arm64|armhf) ;; *) echo "Unsupported architecture: $arch" >&2; exit 1 ;; esac
package="tkmchain_${version#v}_${arch}.deb"

sudo apt-get update
sudo apt-get install -y ca-certificates curl
curl --fail --location --proto '=https' --tlsv1.2 \
  --output "/tmp/$package" \
  "https://github.com/tkmchain/go-tkmchain/releases/download/${version}/${package}"
sudo apt-get install "/tmp/$package"
```

For production deployments, download `SHA256SUMS` from the
[{{TKM_VERSION}} release]({{TKM_RELEASE_URL}}) and verify the selected
package before installing it. The package does not start a node or install
Tor automatically.

### Start through Tor

Install and start Tor before launching the node:

```bash
sudo apt-get install -y tor
sudo systemctl enable --now tor
systemctl is-active tor
```

Run `gtkm` with onion-only P2P, an onion hostname, and an onion bootnode.
Keep HTTP and WebSocket RPC on loopback:

```bash
gtkm \
  --port 3000 \
  --privacy.onion-only \
  --p2p.tor-socks5=socks5://127.0.0.1:9050 \
  --p2p.onion-hostname='<this-node>.onion' \
  --bootnodes='enode://<peer-key>@<peer>.onion:3000?discport=0' \
  --http --http.addr=127.0.0.1 --http.port=8545 \
  --ws --ws.addr=127.0.0.1 --ws.port=8546
```

Do not use `--nat=extip:<ip>`, public RPC bindings, wildcard origins, or
`127.0.0.1:9050` as a peer address. Port `9050` is the local Tor SOCKS
proxy; TKMChain peers use the onion service's P2P port, normally `3000`.

See the full [APT installation guide](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/INSTALL_APT.md),
[Tor installation guide](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/TOR_INSTALLATION.md),
and [privacy deployment guide](https://github.com/tkmchain/go-tkmchain/blob/v1.21.3/docs/PRIVACY_MODE.md).
