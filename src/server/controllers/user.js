import { encrypt, decrypt } from '../utils/crypto.js'; 
import jwt from 'jsonwebtoken';
import UserModal from '../models/user.js'; 

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const decryptedPassword = decrypt(oldUser.password, oldUser.iv);

    if (decryptedPassword !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const { encryptedData, iv } = encrypt(password);

    const result = await UserModal.create({
      email,
      password: encryptedData,
      iv, 
});

    const token = jwt.sign({ email: result.email, id: result._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};