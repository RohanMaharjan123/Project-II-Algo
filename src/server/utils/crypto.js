import crypto from 'crypto';

const ENCRYPTION_KEY = crypto
    .createHash('sha256')
    .update(String(process.env.CRYPTO_SECRET_KEY)) 
    .digest('base64')
    .substr(0, 32); 

export const encrypt = (text) => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
        iv: iv.toString('base64'),  
        encryptedData: encrypted  
    };
};

export const decrypt = (encryptedText, iv) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'base64'));

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted; 
};