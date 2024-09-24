const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

/// Cipher text

const message = 'Advanced Encryption Standard';
const key = randomBytes(32);
const iv = randomBytes(16);

const cipher = createCipheriv('aes256', key, iv);

/// Encryption 

const encryptedMessage = cipher.update(message, 'utf8', 'hex') + cipher.final('hex');
console.log(`Encrypted Message: ${encryptedMessage}`);

/// Decryption

const decipher = createDecipheriv('aes256', key, iv);
const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf8');

console.log(`Deciphered Message: ${decryptedMessage.toString('utf-8')}`);