const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

  user: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type : String
  },
  postId : {
    type : String
  }

},{
  timestamps: true
});


const Comments = mongoose.model('Comments', commentSchema);

module.exports = Comments