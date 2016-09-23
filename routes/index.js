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

// Login page
router.get('/login', function(req, res, next) {
	if (req.session.name && req.session.logined) {	// If already logined than go to homepage
		res.send("<script> alert('您已經登入囉，請先登出再行登入'); window.location='/' </script>");
		res.end();
	}
	else
		res.render('login');
});

// Register page
router.get('/register', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.send("<script> alert('您已經登入囉，請先登出再行註冊'); window.location='/' </script>");
		res.end();
	}
	else
		res.render('register');
});

// Log out
router.get('/signout', function(req, res, next) {
	req.session.name = null;
	req.session.logined = false;
	res.send("<script> alert('您已經成功登出囉!'); window.location='/' </script>");
	res.end();
});

// Add Article
router.get('/add_article', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;

		res.render('article', {title: "Add Article"})
	}
	else
		res.send("<script> alert('您尚未登入，請先登入後再來新增文章喔'); window.location='/' </script>");
		res.end();
});

// Show Profile
router.get('/profile', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		res.locals.username = req.session.name;
		res.locals.logined = req.session.logined;
		Blog.find({ Username: req.session.name }, function(err, blogs, count) {
			res.render('profile', { title: "Profile", blogs: blogs })
		});
	}
	else {
		res.send("<script> alert('您尚未登入，請先登入後再來管理文章喔'); window.location='/' </script>");
		res.end();
	}
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
	else {
		res.send("<script> alert('您尚未登入或文章ID錯誤\n請先登入後再來修改文章喔\n或是再檢查文章ID'); window.location='/' </script>");
		res.end();
	}
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
	else {
		res.send("<script> alert('您尚未登入或文章ID錯誤\n請先登入後再來刪除文章喔\n或是再檢查文章ID'); window.location='/' </script>");
		res.end();
	}
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
	else {
		res.send("<script> alert('您尚未登入或文章ID錯誤\n請先登入後再來刪除文章喔\n或是再檢查文章ID'); window.location='/' </script>");
		res.end();
	}
});

module.exports = router;
