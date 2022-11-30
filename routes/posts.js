const { json, response } = require("express");
const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");

//==================================
//
//            게시글 작성
//
//==================================
router.post("/posts", async (req, res) => {
  //예상할 수 없는 err는 try catch로 잡아줌
  try {
    const { password } = req.body;
    const { user } = req.body;
    const { content } = req.body;
    const { title } = req.body;

    // body값이 들어오지 않을 경우
    if (req.body.length == undefined) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    // DB 등록되는 입력값
    await Posts.create({
      user: user,
      password: password,
      title: title,
      content: content,
    });

    return res.status(200).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    console.error("Catch 에러 발생!!");
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//            게시글 조회
//       postman 구현 확인 완료
//
//==================================
// 게시글 조회 라우터 만들기
router.get("/posts", async (req, res) => {
  try {
    // 모든 post를 불러옴
    // sort 이용해 내림차순 정렬
    const posts = await Posts.find({}).sort({ createdAt: -1 });

    // map 함수를 통해 원하는 정보만 가져옴
    const data = posts.map((post) => {
      return {
        postId: post._id,
        user: post.user,
        title: post.title,
        createdAt: post.createdAt,
      };
    });

    // 리스폰으로 데이터를 불러옴.
    // 데이터는 위에 지정해준 값
    return res.json({ data });
  } catch (error) {
    console.error("Catch 에러 발생!!");
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
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
  try {
    // params를 통해 id 값을 가져옴
    let postId = req.params._postId;

    // 상세 페이지이기 때문에 한가지 정보만 가져오기
    const post = await Posts.findOne({ _id: postId });
    //id에 맞는 정보가 없을 경우
    if (post == null || post.length === 0) {
      return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
    }

    // 원하는 정보만 찍어주기
    res.status(200).json({
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    });
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//            게시글 수정
//       postman 구현 확인 완료
//     에러를 작성하는 건 어떻게 해야할 지 고민
//
//==================================
router.put("/posts/:_postId", async (req, res) => {
  try {
    let postId = req.params._postId;

    const { password } = req.body;
    const { title } = req.body;
    const { content } = req.body;

    if (title == undefined && content == undefined) {
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const changePost = await Posts.findOne({ _id: postId });

    // 바꿀 게시글 정보를 못 찾을 경우
    if (changePost == null || changePost.length === 0) {
      return res.status(404).json({ msg: "게시글 조회에 실패하였습니다." });
    }

    // 비밀번호가 다를 경우
    if (password !== changePost.password || password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 확인해주세요." });
    }

    // 비밀번호가 같을 경우에만 변경
    if (password === changePost.password) {
      await Posts.updateOne(
        { postId: postId },
        {
          $set: {
            // 변경 가능한 내용은 두가지만
            title: title,
            content: content,
          },
        }
      );
      return res.status(200).json({ msg: "게시글을 수정하였습니다." });
    }
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

//==================================
//
//            게시글 삭제
//    패스워드는 암호화를 해야할까?
//
//==================================
router.delete("/posts/:_postId", async (req, res) => {
  try {
    let postId = req.params._postId;
    const password = req.body.password;

    const delPost = await Posts.findOne({ _id: postId });

    // 값을 못찾을 경우
    if (delPost == null || delPost.length === 0) {
      return res.status(400).json({ msg: "게시글 조회에 실패하였습니다.'" });
    }

    // 비밀번호가 다를 경우
    if (delPost.password !== password || password == undefined ) {
      return res.status(400).json({ message: "비밀번호를 확인 해주세요." });
    }

    //모두 통과하면 게시글을 지움
    await Posts.deleteOne({ _id: postId });
    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
