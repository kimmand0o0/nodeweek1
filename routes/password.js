//비밀번호 암호화를 위하여 사용
const bcrypt = require("bcrypt");
const saltRounds = 10;


//====================================
//
//           비밀번호 암호화
// 비밀번호 암호화 하기! bycript의 salt를 이용!
// 몽고DB 매서드 Pre 를 이용
// function( next )가 실행 된 후 save 매서드로 보내준다.
//
//====================================
userSchema.pre('save', function (next) {
   
    //비밀번호 값을 가져온다.
    //this = 현재 폴더의 Schema
    var user = this;

    console.log(user)

  // User 정보를 바꿀 때마다 해시 설정을 하는 것을 막기 위해설정
    if (user.isModified('password')) {

        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            //비밀번호 가져오는 것을 성공했을 경우
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;

                //비밀번호를 해시값으로 대체하는 것을 성공했을 경우 아래를 실행시킴
                next()
            });
        });
    }else{
        next()
  }
});