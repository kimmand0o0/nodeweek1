const { json, response } = require("express");
const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");

//==================================
//
//            게시글 작성
//       postman 구현 확인 완료
//     비밀번호 암호화가 필요할지...? > 과제에는 없지만 해봐도 좋음
//
//==================================
// 게시글 작성 라우터 만들기
router.post("/posts", (req, res) => {
  // 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다
  const posts = new Posts(req.body);

  // mongoDB에 저장을 해주기
  posts.save((err, postInfo) => {
    if (err)
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    else
      res.status(200).json({
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
router.get("/posts", async (req, res) => {
  const posts = await Posts.find({});

  const data = posts.map((post) => {
    return {
      postId: post._id,
      user: post.user,
      title: post.title,
      createdAt: post.createdAt,
    };
  });
  res.json({
    data,
  });
});

//==================================
//
//            게시글 상세
//       postman 구현 확인 완료
//      err일 경우의 수를 어떻게 정의해야할 지 잘 모르겠음.
//
//==================================
// 게시글 상세 라우터 만들기
router.get("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const post = await Posts.findOne({ _id: postId });
  //해당하는 포스트 글이 있는 지 확인 후 에러 처리 추가
  if (delPost == null || delPost.length === 0 ){
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
    const data = {
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };

    return res.status(200).json({
      data,
    });
});

// router.get("/posts/:_postId", async (req, res) => {
//   const postId = req.params._postId;
//   const posts = await Posts.find({ _id: postId });
//   //fideOne
//   //해당하는 포스트 글이 있는 지 확인 후 에러 처리 추가
//   const data = posts.map((post) => {
//     return {
//       postId: post._id,
//       user: post.user,
//       title: post.title,
//       content: post.content,
//       createdAt: post.createdAt,
//     };
//   });
//   if (data.length === 0)
//     return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
//   else // 필요없고
//     res.status(200).json({
//       data,
//     });
// });


//==================================
//
//            게시글 수정
//       postman 구현 확인 완료
//     에러를 작성하는 건 어떻게 해야할 지 고민
//
//==================================
router.put("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const { password } = req.body;
  const { title } = req.body;
  const { content } = req.body;

  const changePost = await Posts.find({ _id: postId });

  if (changePost == null || changePost.length === 0) {
    return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
  }

  if( password !== changePost.password ){
    return res.status(400).json({ msg: "비밀번호를 확인 해주세요." });
  }

  if ( password === changePost.password ) {
    await Posts.updateOne(
      { postId: postId },
      {
        $set: {
          title: title,
          content: content,
        },
      }
    );
  }

  res.status(200).json({ msg: "게시글을 수정하였습니다." });
});

//==================================
//
//            게시글 삭제
//    패스워드는 암호화를 해야할까?
//
//==================================
router.delete("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const password = req.body.password;

  const delPost = await Posts.findOne({ _id: postId });

  if (delPost == null || delPost.length === 0 ){
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
  if(delPost.password !== password){
    return res.status(400).json({ message: '비밀번호를 확인 해주세요.' })
  }
  if(delPost.password === password){
    await Posts.deleteOne({ _id: postId });
    return res.status(200).json({"message": "게시글을 삭제하였습니다."})
  }
});

module.exports = router;
