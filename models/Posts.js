const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

const postSchema = mongoose.Schema({

  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type : String,
    required: true
  },
  content: {
    type : String,
    required: true
  }

},{
  timestamps: true
});


const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts