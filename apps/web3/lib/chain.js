/**
 * Minimal on-chain writer. Sends a 0-value transaction from a burner wallet to
 * itself, with a hex-encoded JSON payload in the `data` field. That produces a
 * real, permanent, publicly-verifiable transaction on a block explorer without
 * needing a smart contract.
 *
 * Everything here is optional: if RPC_URL / WEB3_PRIVATE_KEY / CHAIN_ID are not
 * all set, `isConfigured()` returns false and the caller records the entry in
 * Mongo only. This keeps deployment unblocked on the "fund a testnet wallet" step.
 *
 * Default target: Polygon Amoy testnet (chainId 80002), free POL from
 * https://faucet.polygon.technology
 */
const { createWalletClient, createPublicClient, http, toHex } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const CHAIN_ID = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID, 10) : null;
const RPC_URL = process.env.RPC_URL || '';
const PRIVATE_KEY = process.env.WEB3_PRIVATE_KEY || '';
const EXPLORER_BASE = process.env.EXPLORER_BASE || 'https://amoy.polygonscan.com';

function isConfigured() {
  return Boolean(RPC_URL && PRIVATE_KEY && CHAIN_ID);
}

let cached = null;

function getClients() {
  if (cached) return cached;

  const account = privateKeyToAccount(
    PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`
  );
  const chain = {
    id: CHAIN_ID,
    name: process.env.CHAIN_NAME || `chain-${CHAIN_ID}`,
    nativeCurrency: { name: 'native', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] }, public: { http: [RPC_URL] } },
  };

  cached = {
    account,
    chain,
    wallet: createWalletClient({ account, chain, transport: http(RPC_URL) }),
    publicClient: createPublicClient({ chain, transport: http(RPC_URL) }),
  };
  return cached;
}

/**
 * @param {object} payload  Plain JSON — kept small (calldata costs gas).
 * @returns {Promise<{ txHash: string, explorerUrl: string, chainId: number }>}
 */
async function sendLedgerTx(payload) {
  if (!isConfigured()) {
    throw new Error('web3 chain not configured');
  }
  const { account, wallet } = getClients();
  const data = toHex(JSON.stringify(payload));

  const txHash = await wallet.sendTransaction({
    to: account.address,
    value: 0n,
    data,
  });

  return {
    txHash,
    explorerUrl: `${EXPLORER_BASE.replace(/\/$/, '')}/tx/${txHash}`,
    chainId: CHAIN_ID,
  };
}

module.exports = { isConfigured, sendLedgerTx, CHAIN_ID, EXPLORER_BASE };
