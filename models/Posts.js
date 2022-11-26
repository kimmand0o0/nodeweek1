const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

  user: {
    type: String
  },
  password: {
    type: String,  
    minlength: 5,
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