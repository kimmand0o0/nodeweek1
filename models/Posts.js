const mongoose = require("mongoose");
const Schema = require('mongoose').Schema;

const postSchema = mongoose.Schema({

  user: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type : String
  },
  content: {
    type : String
  }

},{
  timestamps: true
});


const Posts = mongoose.model('Posts', postSchema);

module.exports = Posts