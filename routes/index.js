var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		res.locals.username = req.session.name;
		res.locals.authenticated = req.session.logined;
	}
	catch(e) {}
	req.session.name = "1234"
	res.render('index', { title: 'Blog You' });
});

// Login
router.get('/login', function(req, res, next) {
	if (req.session.name && req.session.logined)
		res.redirect("/")
	else
		res.render('login', { mode: "Login" });
});

// Register
router.get('/register', function(req, res, next) {
	if (req.session.name && req.session.logined)
		res.redirect("/")
	else
		res.render('login', { mode: "Register" });
});

// Check login info
router.post('/apis/login', function(req, res, next) {
	if (isValid(req.body.user, req.body.pwd)) {
		req.session.name = req.body.user;
		req.session.logined = true;
		res.redirect("/");
	}
	else
		res.send("Login Failed!")
	
});

// Log out
router.get('/signout', function(req, res, next) {
	req.session.name = null;
	req.session.logined = false;
	res.redirect("/");
});

function isValid(name, password) {
	return true;
}

module.exports = router;
