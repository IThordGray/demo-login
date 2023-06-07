import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const IV_LENGTH = 16; // 16 bytes for AES-256-CBC
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env['ENCRYPTION_KEY'] || ''; // Retrieve encryption key from environment variable

export class AES_256_CBC {
  static encrypt(value: string): string {
    // Generate a random IV for each encryption
    const iv = randomBytes(IV_LENGTH);

    // Create a cipher object for AES-256-CBC with the encryption key and random IV
    const cipher = createCipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    // Encrypt the value and return the IV and encrypted data as a string
    let encrypted = cipher.update(value, 'utf-8', 'base64');
    encrypted += cipher.final('base64');
    return `${ iv.toString('base64') }:${ encrypted }`;
  }

  static decrypt(encrypted: string): string {
    // Split the IV and encrypted data from the input string
    const [ ivString, encryptedString ] = encrypted.split(':');

    // Decode the IV from base64
    const iv = Buffer.from(ivString, 'base64');

    // Create a decipher object for AES-256-CBC with the encryption key and IV
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);

    // Decrypt the encrypted data and return the result as a string
    const decrypted = decipher.update(encryptedString, 'base64', 'utf-8');
    return decrypted + decipher.final('utf-8');
  }
}
