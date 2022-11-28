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
router.post("/posts", async (req, res) => {
  //예상할 수 없는 err는 try catch로 잡아줌
  try {
    const { password } = req.body;
    const { user } = req.body;
    const { content } = req.body;
    const { title } = req.body;

    // body값이 들어오지 않을 경우

    // 비밀번호 값을 입력하지 않은 경우
    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    // DB 등록되는 입력값
    await Posts.create({
      user: user,
      password: password,
      title: title,
      content: content,
    });

    res.status(200).json({ message: "게시글을 생성하였습니다." });
  } catch (error) {
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
    const posts = await Posts.find({});

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
    res.json({
      data,
    });
  } catch (error) {
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

    // Params가 잘못되었을 경우
    if (postId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    // 상세 페이지이기 때문에 한가지 정보만 가져오기
    const post = await Posts.findOne({ _id: postId });
    //id에 맞는 정보가 없을 경우
    if (post == null || post.length === 0) {
      return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
    }

    // 원하는 정보만 찍어주기
    const data = {
      postId: post._id,
      user: post.user,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
    };

    // 데이터 가져오기
    return res.status(200).json({
      data,
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

    // Params가 잘못되었을 경우
    if (postId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const { password } = req.body;
    const { title } = req.body;
    const { content } = req.body;

    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    const changePost = await Posts.findOne({ _id: postId });

    // 바꿀 게시글 정보를 못 찾을 경우
    if (changePost == null || changePost.length === 0) {
      return res.status(400).json({ msg: "게시글 조회에 실패하였습니다." });
    }

    // 비밀번호가 다를 경우
    if (password !== changePost.password) {
      return res.status(400).json({ msg: "비밀번호를 확인 해주세요." });
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
    }

    res.status(200).json({ msg: "게시글을 수정하였습니다." });
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

    // Params가 잘못되었을 경우
    if (postId.length !== 24) {
      postId = "000000000000000000000000";
      return res.status(400).json({ msg: "데이터 형식이 올바르지 않습니다." });
    }

    const password = req.body.password;

    if (password == undefined) {
      return res.status(400).json({ msg: "비밀번호를 입력해주세요." });
    }

    const delPost = await Posts.findOne({ _id: postId });

    // 값을 못찾을 경우
    if (delPost == null || delPost.length === 0) {
      return res.status(400).json({ msg: "게시글 조회에 실패하였습니다.'" });
    }

    // 비밀번호가 다를 경우
    if (delPost.password !== password) {
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
