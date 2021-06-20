// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();

const login = require('./login.js');
const join = require('./join.js')

router.use('/login', login);
router.use('/join', join);

module.exports = router;