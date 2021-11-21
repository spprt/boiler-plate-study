const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const { User } = require('./models/User');


//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jwkim:abcd1234@boilerplate.ztnb1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  . catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!~~:)!!')
})


app.post('/register', (req, res) => {

  // 회원가입 정보
  const user = new User(req.body); // bodyParser를 이용하여 client body정보 확인
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success:true
    })
  })

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})