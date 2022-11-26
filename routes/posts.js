const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");


//==================================
//
//            게시글 작성
//       postman 구현 확인 완료
//
//==================================
// 게시글 작성 라우터 만들기
router.post("/posts", (req, res) => {
  // 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다
  const posts = new Posts(req.body);
  console.log(req.body)

  // mongoDB에 저장을 해주기
  posts.save((err, postInfo) => {
    console.log(postInfo)
    if (err)
      return res
        .status(400)
        .json({ success: false, msg: "데이터 형식이 올바르지 않습니다." });
    else res.status(200).json({
      success: true,
      msg: "게시글을 생성하였습니다.",
    });
  });
});

//==================================
//
//            게시글 조회
//       postman 구현 확인 완료
//
//==================================
// 게시글 조회 라우터 만들기
router.get("/posts", (req, res) => {
  Posts.find((err, data) => {
    if (err) return res.status(400).send({ success: false, err: err });
    else return res.status(200).send({data});
  });
});

//==================================
//
//            게시글 상세
//
//==================================
// 게시글 상세 라우터 만들기
router.get("/posts/:_postId", (req, res) => {
  Posts.find((err, doc) => {
    if (err)
      return res
        .status(400)
        .send({
          success: false,
          err: err,
          message: "데이터 형식이 올바르지 않습니다.",
        });
    else
      return res.status(200).send({
        postId: req.body._id,
        user: req.body.user,
        title: req.body.title,
        content: req.body.content,
        createdAt: req.body.createdAt,
      });
  });
});

//==================================
//
//            게시글 수정
//
//==================================


//==================================
//
//            게시글 삭제
//
//==================================



module.exports = router;
