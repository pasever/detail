const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) throw err;
    user.password = hash;
    next();
  })
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
