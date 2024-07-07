const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'principal'], required: true },
  verified: { type: Boolean, default: false },
  class_: { type: String, required: function() { return this.role === 'student'; } },
  section: { type: String, required: function() { return this.role === 'student'; } },
  teachesClass: { type: String, required: function() { return this.role === 'teacher'; } },
  teachesSection: { type: String, required: function() { return this.role === 'teacher'; } },
  orgId: { type: String, required: true },
  image: { type: String }
});

module.exports = mongoose.model('User', userSchema);
