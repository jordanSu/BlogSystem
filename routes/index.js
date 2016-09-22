var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
	try {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;
	}
	catch(e) {}
	Blog.find(function(err, blogs, count) {
		res.render('index', { title: 'Blog You', blogs: blogs });
	});

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

// Log out
router.get('/signout', function(req, res, next) {
	req.session.name = null;
	req.session.logined = false;
	res.redirect("/");
});

// Add Article
router.get('/add_article', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;

		res.render('article', {title: "Add Article"})
	}
	else
		res.redirect("/");
});



// Show Profile
router.get('/profile', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;
		Blog.find({ Username: req.session.name }, function(err, blogs, count) {
			res.render('profile', { title: "Profile", blogs: blogs })
		})
	}
	else
		res.redirect("/");
});

// Modify Article
router.get('/modify/:article_id', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;
		res.locals.articleID = req.params.article_id
		Blog.find({ _id: req.params.article_id }, function(err, blogs, count) {
			res.render('article', { title: "Edit your article", article: blogs[0].Article })
		})
	}
	else
		res.redirect("/");
});

// Delete Article
router.get('/delete/:article_id', function(req, res, next) {
	if (req.session.name && req.session.logined && req.params.article_id) {
		Blog.remove({ _id: req.params.article_id },
		function(err) {
			if (err)
				console.log("Fail to delete article")
			else
				console.log("Delete OK!")
		});
		res.redirect("/profile")
	}
	else
		res.redirect("/");
});

// Leave a message
router.get('/message/:article_id', function(req, res, next) {
	if (req.session.name && req.session.logined && req.params.article_id) {
		res.locals.articleID = req.params.article_id;
		Blog.find({ _id: req.params.article_id },
		function(err, blogs, count) {
			Comment.find({ MessageID: req.params.article_id },
			function(err, comments, count) {
				res.render("message", { article: blogs[0], comments: comments })
			})
		})
	}
	else
		res.redirect("/");
});

function isValid(name, password) {
	return true;
}

module.exports = router;
