const express = require('express')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jwkim:abcd1234@boilerplate.ztnb1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  . catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!~~:)!!')
})


app.post('/api/users/register', (req, res) => {

  // 회원가입 정보
  const user = new User(req.body); // bodyParser를 이용하여 client body정보 확인
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success:true
    })
  })

})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 확인
  
  User.findOne({ email : req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess:false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 비밀번호가 같은지 확인
    user.comparePassword(req.body.password, (err, isMatch)=> {
      if(!isMatch)
        return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다"})
      // 비밀번호가 맞다면 토큰생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // token 저장 쿠키or localstorage
        res.cookie('x_auth', user.token)
        .status(200)
        .json({loginSuccess:true, userId:user._id})
      }) // 12 token
    })
  })
})
app.get('/api/users/auth', auth, (req, res) => {
  
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  })
})
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    {token:""}
    , (err, user) => {
      if(err) return res.json({success:false, err});
      return res.status(200).send({
        success:true
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})