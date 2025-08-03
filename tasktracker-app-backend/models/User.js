const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// const users = [...] // Hardcoded array
// app.post("/api/auth/login", (req, res) => {
// // Array find logic
// });

// // NEW:
// app.post("/api/auth/login", async (req, res) => {
// try {
// const user = await User.findOne({ email });
// // Database find logic
// } catch (err) {
// res.status(500).json({ message: "Error during login" });
// }
// });