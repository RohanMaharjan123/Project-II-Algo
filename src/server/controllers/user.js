import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModal from "../models/user.js";
import { encrypt, decrypt } from '../utils/crypto.js'; // Import AES encryption functions

// Sign up
export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Encrypt the email
    const { iv: emailIv, encryptedData: encryptedEmail } = encrypt(email);
    
    // Check if the user exists
    const oldUser = await UserModal.findOne({ email: encryptedEmail });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user with encrypted email
    const result = await UserModal.create({ 
      email: encryptedEmail, 
      password: hashedPassword, 
      emailIv // Save the IV for later decryption
    });

    // Generate token
    const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

// Sign in
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Encrypt the incoming email to compare
    const { encryptedData: encryptedEmail } = encrypt(email);

    // Find user by encrypted email
    const oldUser = await UserModal.findOne({ email: encryptedEmail });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};