const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

  user: {
    type: String,
    maxlaength: 50,
  },
  password: {
    type: String,  
    minlength: 5,
  },
  content: {
    type : String
  }

},{
  timestamps: true
});


const Comments = mongoose.model('Comments', commentSchema);

module.exports = Comments