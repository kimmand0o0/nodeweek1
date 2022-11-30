const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type : String,
    required: true
  },
  postId : {
    type : String,
    required: true
  }

},{
  timestamps: true
});


const Comments = mongoose.model('Comments', commentSchema);

module.exports = Comments