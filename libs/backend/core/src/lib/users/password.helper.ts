import { randomBytes, createHash, timingSafeEqual } from 'crypto';

const saltSize = 16;
const hashAlgorithm = 'sha256';

export async function hashPasswordAsync(password: string): Promise<string> {
  if (!password) throw new Error('Password is required');
  const salt = randomBytes(saltSize).toString('hex');
  const hash = createHash(hashAlgorithm);
  hash.update(salt + password);
  const hashedPassword = hash.digest('hex');
  return `${ salt }.${ hashedPassword }`;
}

export async function hashAndCompareAsync(password: string, hash: string | null | undefined): Promise<boolean> {
  if (!password || !hash) return false;
  const [ salt, hashedPassword ] = hash.split('.');
  const hashToCompare = createHash(hashAlgorithm);
  hashToCompare.update(salt + password);
  const hashedPasswordToCompare = hashToCompare.digest('hex');
  return timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(hashedPasswordToCompare));
}
