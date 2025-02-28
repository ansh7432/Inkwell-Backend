const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 6,
  },
  password:{
    type:String,
    required:true,
  }
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
