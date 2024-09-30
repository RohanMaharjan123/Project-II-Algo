import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  iv: { type: String, required: true } 
});

const UserModal = mongoose.model('User', userSchema);

export default UserModal;