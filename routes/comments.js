const { json, response } = require("express");
const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
const Posts = require("../models/Posts");

//==================================
//
//            댓글 생성
//      데이터 값이 바르지 않을 때 에러 쏘는 걸 고민하는 중...
//
//==================================
// 게시글 작성 라우터 만들기
router.post("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const { password } = req.body;
  const { user } = req.body;
  const { content } = req.body;

  const post = await Posts.find({ postId: postId });
  if (post == null || post.length === 0) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }

  await Comments.create({
    user : user,
    password : password,
    content : content,
    postId : postId
  });

  res.status(200).json({ "message": "댓글을 생성하였습니다." });
});

//==================================
//
//           댓글 목록 조회
//
//==================================
router.get("/comments/:_postId", async (req, res) => {
  const comments = await Comments.find({});

  if (comments == null || comments.length === 0) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }

  const data = comments.map((comment) => {
    return {
      commentId: comment._id,
      user: comment.user,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  });
  res.json({
    data,
  });
});

//==================================
//
//            댓글 수정
//
//==================================
router.put("/comments/:_commentId", async (req, res) => {
  const commentId = req.params._commentId;
  const { password } = req.body;
  const { content } = req.body;

  const changeComment = await Comments.findOne({ _id: commentId });

  if (changeComment == null || changeComment.length === 0) {
    return res.status(400).json({ msg: "댓글 조회에 실패하였습니다." });
  }

  if( password !== changeComment.password ){
    return res.status(400).json({ msg: "비밀번호를 확인 해주세요." });
  }

  if ( password === changeComment.password ) {
    await Comments.updateOne(
      { commentId : commentId },
      {
        $set: {
          content: content,
        },
      }
    );
  }

  res.status(200).json({ msg: "댓글을 수정하였습니다." });
});

//==================================
//
//             댓글 삭제
//
//==================================
router.delete("/comments/:_commentId", async (req, res) => {
  const commentId = req.params._commentId;
  const password = req.body.password;

  const delComment = await Comments.findOne({ _id: commentId });

  if (delComment == null || delComment.length === 0) {
    return res.status(400).json({  msg: "댓글 조회에 실패하였습니다." });
  }
  if (delComment.password !== password) {
    return res
      .status(400)
      .json({ message: "비밀번호를 확인 해주세요." });
  }
  if (delComment.password === password) {
    await Comments.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "댓글을 삭제하였습니다." });
  }
});

module.exports = router;
