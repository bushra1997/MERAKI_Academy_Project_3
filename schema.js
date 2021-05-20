const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const users = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  country: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
});

const salt = 10;
users.pre("save", async function () {
  this.email = this.email.toLowerCase();
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

const articles = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.ObjectId, ref: "Users" },
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comments" }],
});

const comments = new mongoose.Schema({
  comment: { type: String },
  commenter: { type: mongoose.Schema.ObjectId, ref: "Users" },
});
const Users = mongoose.model("Users", users);
const Arts = mongoose.model("Arts", articles);
const Comments = mongoose.model("Comments", comments);
module.exports.Users = Users;
module.exports.Arts = Arts;
module.exports.Comments = Comments;
