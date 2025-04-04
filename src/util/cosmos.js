// eslint-disable-next-line import/no-extraneous-dependencies
import bech32 from 'bech32';

const ALLOWED_ADDRESS_PREFIXES = ['like'];

export function isValidAddress(address) {
  try {
    const { prefix } = bech32.decode(address);
    return ALLOWED_ADDRESS_PREFIXES.includes(prefix);
  } catch (error) {
    return false;
  }
}

export function convertAddressPrefix(address, prefix = 'like') {
  const { words } = bech32.decode(address);
  return bech32.encode(prefix, words);
}

export async function signLoginMessage(signer, address, action, permissions) {
  const payload = JSON.stringify({
    ts: Date.now(),
    address,
    action,
    permissions,
    evmWallet: address,
  });
  if (signer.signMessage) {
    const signed = await signer.signMessage(payload);
    return {
      signature: signed,
      message: payload,
      wallet: address,
      from: address,
      signMethod: 'personal_sign',
      expiresIn: '30d',
    };
  }
  throw new Error('SIGNER_NOT_SUPPORT_AMINO');
}
