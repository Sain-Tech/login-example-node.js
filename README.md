# login-example-node.js
Node.js와 MySQL을 이용한 로그인 및 회원가입 예제

## 사용법

Express 설치

```console
$ npm install express
$ npm install express-generator
$ npm install ejs
```

서버 디렉토리 세팅

```console
$ express -e LoginExample
$ cd LoginExample
$ npm install
```

세션 및 MySQL 모듈 설치

```console
$ npm install express-session --save
$ npm install sync-mysql --save
```

회원가입 사용자 정보를 위한 데이터베이스 생성

```console
mysql> CREATE DATABASE IF NOT EXISTS userInfo CHARACTER SET utf8 COLLATE utf8_general_ci;
```

routes/index.js에 MySQL 비밀번호 세팅

```
var connection = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '비밀번호',
    database: 'userInfo'
}
```
