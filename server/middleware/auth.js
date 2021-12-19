const { User } = require("../models/User");

let auth = (req, res, next) => {
    //인증처리
    // client cookie에서 token 가져오기
    let token = req.cookies.x_auth;
    //토큰 복호화, user find
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:true})

        req.token = token;
        req.user = user;
        next(); // middle웨어에서 다 처리후 다음으로 갈 수 있도록
    })
    // 유저가 있으면 인증
    // 유저강 없으면 인증 불가
}

module.exports = { auth };