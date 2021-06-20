var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var loginRouter = require('./routes/login');
var joinRouter = require('./routes/join');
var mainRouter = require('./routes/main');

//인공지능 파이썬 파일 실행부분
const { PythonShell } = require('python-shell');

//APP알림 부분
var FCM = require('fcm-node');
var serverKey = 'AAAA-gZOHE0:APA91bGcTUhe9BBwHJzggb6s-MJBlQgmKZDtXf_TPkQDkkTRdGegIuF3EQsVKqJi3mNL39-Y5hmYVL7K2gb3m-CWzVBKy1NuOYFPDzzojairFku_ZCMMoSmopfw2jln31QDhs7fkIvxk';
var fcm = new FCM(serverKey);

var message = {
  to : 'dl_r164-RBu4bVfS1kFQYL:APA91bFbBzwae16LI8XtKD5rtsBLugVrXunHLZC0DtMt2sp4HYARBGXN2xrO1tcrhXxaQfWSyAQFnQ_2tJYQD5FUshAO7atvXV8SHNQZv1G7A3WCEc6hZXP7alq9sYJRDVWXM290lQ9V',

  notification: {
    title: 'WARNING!!',
    body:'텐트 주변에 외부인이 감지되었습니다.'
  },
  data: {
    my_key: 'my value',
    my_another_key: 'my another value'
  }
};

var message1 = {
  to : 'dl_r164-RBu4bVfS1kFQYL:APA91bFbBzwae16LI8XtKD5rtsBLugVrXunHLZC0DtMt2sp4HYARBGXN2xrO1tcrhXxaQfWSyAQFnQ_2tJYQD5FUshAO7atvXV8SHNQZv1G7A3WCEc6hZXP7alq9sYJRDVWXM290lQ9V',

  notification: {
    title: 'CLEAR!!',
    body:'얼굴인식이 끝났습니다.'
  },
  data: {
    my_key: 'my value',
    my_another_key: 'my another value'
  }
};

//DB관련
var mysql = require('mysql');
const { fstat } = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Connection 객체 생성 
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',   
  password: '1234',
  database: 'rs3'  
});  

// Connect
connection.connect(function (err) {   
  if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;   
  } 
});


app.post('/member/join',function(req,res){
  console.log(req.body);
  var User_ID = req.body.User_ID;
  var User_PW = req.body.User_PW;
  var User_NAME = req.body.User_NAME;
  var User_SEX = req.body.User_SEX;
  var User_PHONE = req.body.User_PHONE;
  var User_EMAIL = req.body.User_EMAIL;

  var sql = 'INSERT INTO member (User_ID, User_PW, User_NAME, User_SEX, User_PHONE, User_EMAIL) VALUES (?,?,?,?,?,?)';
  var params = [User_ID, User_PW, User_NAME, User_SEX, User_PHONE, User_EMAIL];

 connection.query(sql, params, function (err, result) {
      
      if (err) {
          console.log(err);
      } else {

        res.json({
          result: true,
          msg : '회원가입에 성공했습니다.'
        });
      }
  });
});


//아이디 중복확인
app.post('/member/checkId',function (req,res){
  console.log(req.body.User_ID);
  var User_ID = req.body.User_ID;
  var sql = 'select * from member where User_ID = ?';

  connection.query(sql, User_ID, function(err, result) {
    if (err){
      console.log(err);
    } else {
      if (result.length === 0) {
        res.json({
          result:false,
          msg:'사용가능한 아이디입니다.'
        });
      } else {
        res.json({
          result: true,
          msg: '중복된 아이디가 존재합니다'
        });
      }
    }
  });
});

app.post('/member/login', function (req, res) {
  
   var User_ID = req.body.User_ID;
   var User_PW = req.body.User_PW;
   var sql = 'select * from member where User_ID = ?';
   var params = [User_ID, User_PW];
  
   connection.query(sql, params, function(err, result) {
     var resultCode = 404;
     var message = '에러가 발생했습니다';

     if (err) {
         console.log(err);
     } else {
         if (result.length === 0) {
           console.log('없')
             resultCode = 204;
             exist_result = false,
             message = '존재하지 않는 계정입니다!';
         }
         else if (User_ID !== result[0].User_ID) {
          resultCode = 204;
          exist_result = false,
          message = '존재하지 않는 계정이거나 아이디가 틀렸습니다!';
         } 
         else if (User_PW !== result[0].User_PW) {
             resultCode = 204;
             exist_result = false,
             message = '비밀번호가 틀렸습니다!';
         } 
         else {
           console.log('tjd', result[0].User_NAME);
             resultCode = 200;
             exist_result = true,
             message = '로그인 성공! ' + result[0].User_NAME + '님 환영합니다!';
             Nowid = result[0].User_NAME;
         }
         console.log(resultCode,message);
          res.json({
           'resultCode': resultCode,
            result : exist_result,
            msg : message,
           'message' : message
       });
       }
     return;
   });
  });

app.post('/camera/detection', function (req, res){
  console.log("얼굴인식 시작");
  const spawn = require('child_process').spawn
  const result = spawn('python', ['C:/Users/507/Desktop/object_detection/facetest.py',Nowid]);
  result.stdout.on('data', function(data) {
      if(data.toString() == 'unknown'){
        fcm.send(message, function(err, response) {
          if (err) {
            console.log("Something has gone wrong!");
          } else {
            console.log("Successfully sent with response: ", response);
          }
        });
        
      }
  });
});

app.post('/camera/face', function (req, res){
  const spawn = require('child_process').spawn; 
  const result = spawn('python', ['C:/Users/507/Desktop/object_detection/face.py',Nowid]); 
  result.stdout.on('data', (result)=>{ 
    console.log(result.toString()=="End");
    if(result.toString()=="End"){
      const result1 = spawn('python', ['C:/Users/507/Desktop/object_detection/facetrain.py',Nowid]); 
      result1.stdout.on('data', (result)=>{ 
        if(result.toString() == 'FINISH'){
          fcm.send(message1, function(err, response) {
            if (err) {
              console.log("Something has gone wrong!");
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });
        }
      });
      result1.stderr.on('data', function(data) { 
        console.log(data.toString()); 
      });
    }
  });
});

app.post('/spot/place', function (req, res){
  console.log(req.body);
  var User_ID = req.body.User_ID;
  var User_LATITUDE = req.body.User_LATITUDE;
  var User_LONGITUDE = req.body.User_LONGITUDE;

  var sql = 'INSERT INTO  rs3.spot (User_ID, User_LATITUDE, User_LONGITUDE) VALUES (?,?,?)';
  var params = [User_ID, User_LATITUDE, User_LONGITUDE];

  connection.query(sql, params, function (err, result){
    if(err) {
      console.log(err);
    } else {
      res.json({
        result: true,
        msg : '위치 저장에 성공했습니다.'
      });
    }
  });
});

//내가등록한 마커 좌표 불러오기
app.post('/spot/user', function (req, res) {
  var User_ID = req.body.User_ID;
  var sql = 'select * from spot where User_ID = ?';

  connection.query(sql, User_ID, function(err, rows) {
    if(err){
      console.log(err);
    } else {
    }  
    res.json({
      'rows': rows,
    });
  });
});

//전체 회원마커 좌표 불러오기
app.post('/spot/member', function (req, res) {
  var sql = 'SELECT User_LATITUDE, User_LONGITUDE FROM spot';

  connection.query(sql, function(err, rows) {
    if(err){
      console.log(err);
    } else { 
    }  
    res.json({
      'rows': rows,
    });
  });
});

const multer = require('multer');


  const storage = multer.diskStorage({
    destination : (req, file, cb) => {
      cb(null, './uploads') //파일 업로드 저장위치 설정
    },
    filename : (req, file, cb) =>{
      const originalFileName = file.originalname.split('.');
      let fileName = 'none';
      if (originalFileName.length > 0)
      {
        fileName=`${originalFileName[0]}-${Date.now()}.${originalFileName[1]}`
      }
      cb(null, fileName);//파일명
    }
  });
const upload = multer({dest: './uploads'});//파일 업로드시 저장위치 설정

//리뷰 업로드 
app.post('/spot/reviewup',upload.single('Spot_IMG'), function(req,res){
  var User_ID = req.body.User_ID;
  var User_LATITUDE = req.body.User_LATITUDE;
  var User_LONGITUDE = req.body.User_LONGITUDE;
  var Spot_IMG = req.file.filename;
  var Spot_RANK = req.body.Spot_RANK;
  var Spot_PLACENAME = req.body.Spot_PLACENAME;
  var Spot_REVIEW = req.body.Spot_REVIEW;
  var sql = 'UPDATE rs3.spot SET Spot_IMG = ?, Spot_RANK=?, Spot_PLACENAME=?, Spot_REVIEW=? WHERE User_ID=? AND User_LATITUDE=? AND User_LONGITUDE= ?';
  var params = [Spot_IMG, Spot_RANK, Spot_PLACENAME, Spot_REVIEW, User_ID, User_LATITUDE, User_LONGITUDE];

 connection.query(sql, params, function (err, result) {
console.log(params);
      if (err) {
          console.log(err);
      } else {
        message = '업로드 성공';
        res.json({
          msg : message,
        });
      }
  });
});

//저장된 리뷰 보기
app.use(express.static('uploads')); //uploads파일에 업로드된 사진

app.post('/reviewlist', function (req, res) {
  var User_LATITUDE = req.body.User_LATITUDE2;
  var User_LONGITUDE = req.body.User_LONGITUDE2;
  var sql = 'SELECT * FROM rs3.spot WHERE  User_LATITUDE = ? AND User_LONGITUDE = ?';
  var params = [User_LATITUDE, User_LONGITUDE];

  connection.query(sql, params, function(err, rows) {
    if(err){
      console.log(err);
    } else {
    }  
    res.json({
      'rows': rows,
    });
  });
});

module.exports = app;