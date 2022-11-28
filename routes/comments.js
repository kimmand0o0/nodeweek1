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
  try {
    // params로 게시글 id 값을 가져온다
    let postId = req.params._postId;

    // Params가 잘못되었을 경우
    if (postId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const { password } = req.body;
    const { user } = req.body;
    const { content } = req.body;

    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    // id 정보에 맞는 게시글을 가져온다.
    const post = await Posts.findOne({ postId: postId });

    // 게시글을 찾지 못할 경우
    if (post == null || post.length === 0) {
      return res.status(400).json({ msg: "게시글을 찾을 수 없습니다." });
    }

    // DB에 등록되는 입력값
    await Comments.create({
      user: user,
      password: password,
      content: content,
      // 게시글 id도 같이 등록해준다.
      postId: postId,
    });

    res.status(200).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//           댓글 목록 조회
//
//==================================
router.get("/comments/:_postId", async (req, res) => {
  try {
    // params를 통해 게시글 id 값을 가져옴
    let postId = req.params._postId;
    // Params가 잘못되었을 경우
    if (postId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    // id 정보에 맞는 댓글 정보를 가져온다.
    const comments = await Comments.find({ postId: postId });

    // 맞는 정보가 없을 경우
    if (comments == null || comments.length === 0) {
      return res.status(400).json({ msg: "댓글 조회에 실패하였습니다." });
    }

    // 원하는 정보만 찍어주기
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
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//            댓글 수정
//
//==================================
router.put("/comments/:_commentId", async (req, res) => {
  try {
    // params를 통해 댓글 id 값을 가져옴
    let commentId = req.params._commentId;
    // Params가 잘못되었을 경우
    if (commentId.length !== 24) {
      commentId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const { password } = req.body;
    const { content } = req.body;

    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    // id에 맞는 댓글 정보 하나를 불러온다.
    const changeComment = await Comments.findOne({ _id: commentId });

    // 댓글을 찾을 수 없는 경우
    if (changeComment == null || changeComment.length === 0) {
      return res.status(400).json({ msg: "댓글 조회에 실패하였습니다." });
    }

    // 비밀번호가 맞지 않는 경우
    if (password !== changeComment.password) {
      return res.status(400).json({ msg: "비밀번호를 확인 해주세요." });
    }

    // 비밀번호가 맞으면 수정 해준다.
    if (password === changeComment.password) {
      await Comments.updateOne(
        { commentId: commentId },
        {
          $set: {
            content: content,
          },
        }
      );
    }

    res.status(200).json({ msg: "댓글을 수정하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//             댓글 삭제
//
//==================================
router.delete("/comments/:_commentId", async (req, res) => {
  try {
    // 코멘트 id를 받아옴
    let commentId = req.params._commentId;
    // Params가 잘못되었을 경우
    if (commentId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const password = req.body.password;

    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    // id에 맞는 정보 하나를 불러온다.
    const delComment = await Comments.findOne({ _id: commentId });

    // 값을 찾지 못할 경우
    if (delComment == null || delComment.length === 0) {
      return res.status(400).json({ msg: "댓글 조회에 실패하였습니다." });
    }
    
    // 비밀번호가 다를 경우
    if (delComment.password !== password) {
      return res.status(400).json({ message: "비밀번호를 확인 해주세요." });
    }

    // 모두 통과하면 댓글을 지움
    await Comments.deleteOne({ _id: commentId });
    return res.status(200).json({ message: "댓글을 삭제하였습니다." });

  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
