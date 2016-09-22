var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

// Check login info
router.post('/login', function(req, res, next) {
	if (isValid(req.body.user, req.body.pwd)) {
		req.session.name = req.body.user;
		req.session.logined = true;
		res.redirect("/");
	}
	else
		res.send("Login Failed!")
});

// Add Article to Database
router.post('/add', function(req, res, next) {
	if (req.session.name && req.session.logined) {
		new Blog({ Username: req.session.name, Article: req.body.Content, CreateDate: Date.now() })
			.save(function(err) {
				if (err) {
					console.log("Fail to Save to DB")
					next();
				}
				console.log("Save to DB!")
			})
		res.redirect("/")
	}
	else
		res.redirect('/')
});

// Update DB info
router.post('/modify', function(req, res, next) {
	if (req.session.name && req.session.logined && req.body.articleID) {
		Blog.update( { _id: req.body.articleID }, { Article: req.body.Content},
		function(err) {
			if (err)
				console.log('Fail to update!')
			else
				console.log('Update Success!')
		});
		res.redirect("profile");
	}
	else
		res.redirect('/');
});

// Add comment to Database
router.post('/message', function(req, res, next) {
	if (req.session.name && req.session.logined && req.body.articleID) {
		new Comment({ Visitor: req.body.visitor, Comment: req.body.Content, MessageID:req.body.articleID, CreateDate: Date.now() })
			.save(function(err) {
				if (err) {
					console.log("Fail to Save to DB")
					next();
				}
				console.log("Save to DB!")
			})
		res.redirect("/")
	}
	else
		res.redirect('/');
});


module.exports = router;
