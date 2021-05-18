const mongoose = require("mongoose");

const users = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  country: { type: String },
  email: { type: String },
  password: { type: String },
});

const articles = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.ObjectId, ref: "Users" },
});

const Users = mongoose.model("Users", users);
const Arts = mongoose.model("Arts", articles);
module.exports.Users = Users;
module.exports.Arts = Arts;
