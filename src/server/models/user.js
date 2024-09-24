import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  emailIv: { type: String, required: true }, // Store the IV for email encryption
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const UserModal = mongoose.model('UserModal', userSchema);

export default UserModal;