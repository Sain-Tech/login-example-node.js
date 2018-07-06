var express = require('express');
var session = require('express-session');
var mysql = require('sync-mysql');
var router = express.Router();

var connection = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'userInfo'
}

//connectDB.query("CREATE DATABASE IF NOT EXISTS userInfo CHARACTER SET utf8 COLLATE utf8_general_ci;");

router.use(session({
    secret: '1!2@3#4$5%',
    resave: false,
    saveUninitialized: true
}));

var connectDB = new mysql(connection);
var result = null;

/* GET home page. */
router.get('/', function(req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS USERS(userId CHAR(30), userPw TEXT, userEmail TEXT, PRIMARY KEY(userId)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  console.log('테이블 생성됨');
  if(req.session.userId) {
    res.redirect('/result/'+req.session.userId);
  }
  else {
    res.render('loginmain', { title: '로그인' });
  }
});

router.get('/result/:id', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else if(req.session.userId != req.params.id) {
    res.send('<script type="text/javascript">alert("권한이 없는 사용자입니다."); history.back();</script>');
  }
  else {
    res.render('result', {
      title: req.session.userId,
      uid: result[0].userId,
      uemail: result[0].userEmail
    });
  }
});

router.get('/result', function(req, res) {
  if(!req.session.userId) {
    res.send('<script type="text/javascript">alert("권한이 없습니다. 다시 로그인 해주세요."); history.back();</script>');
  }
  else {
    res.redirect('/result/'+req.session.userId);
  }
});

router.get('/logout', function(req, res) {
  delete req.session.userId;
  res.redirect('/');
});

router.post('/signin', function(req, res) {
  var id = req.body.id;
  var pw = req.body.passwd;
  
  if(id == '' || pw == '') {
    res.send('<script type="text/javascript">alert("아이디와 비밀번호를 입력해주세요."); history.back();</script>');
  }
  else {
    result = connectDB.query("SELECT * FROM USERS WHERE userId='"+id+"';");
    if(result.length < 1) {
      res.send('<script type="text/javascript">alert("존재하지 않는 사용자입니다."); history.back();</script>');
    }
    else if(result[0].userPw != pw){
      res.send('<script type="text/javascript">alert("비밀번호가 잘못되었습니다."); history.back();</script>');
    }
    else {
      req.session.userId = id;
      res.redirect('/result/'+req.session.userId);
    }
  }
});

router.get('/signup', function(req, res) {
  res.render('signup', { title: 'Sign up' });
});

router.post('/signup', function(req, res) {
  var id = req.body.id;
  var pw = req.body.passwd;
  var pwconfm = req.body.passwdconfm;
  var email = req.body.email;

  if(id == '' || pw == '' || pwconfm == '' || email == '') {
    res.send('<script type="text/javascript">alert("모든 정보를 입력해주세요."); history.back();</script>');
  }
  else if(connectDB.query("SELECT * FROM USERS WHERE userId='"+id+"';").length > 0) {
    res.send('<script type="text/javascript">alert("사용할 수 없는 아이디입니다."); history.back();</script>');
  }
  else if(pw != pwconfm) {
    res.send('<script type="text/javascript">alert("비밀번호 입력을 확인해주세요."); history.back();</script>');
  }
  else {
    var sql = "INSERT INTO USERS VALUES('"+id+"', '"+pw+"', '"+email+"');"
    connectDB.query(sql);
    console.log('데이터 입력됨');
    res.send('<script type="text/javascript">alert("승인되었습니다. 로그인 해주세요."); location.replace("/");</script>');
  }
});

module.exports = router;
