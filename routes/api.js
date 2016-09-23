var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

// Check login info
router.post('/login', function(req, res, next) {
	console.log("hello!");
	User.find({ Username: req.body.user }, function(err, user, count) {
		if (user[0]) {
			var hash = crypto.createHash('sha256');
			hash.update(req.body.pwd);
			var Password = hash.digest('hex');
			if (Password == user[0].Password) {
				req.session.name = user[0].Username;
				req.session.logined = true;
                res.send("<script> alert('您已經成功登入囉!'); window.location='/' </script>");
        		res.end();
			}
			else {
                res.send("<script> alert('密碼有誤，請您再次檢查'); window.location='/login' </script>");
        		res.end();
			}
		}
		else {
            res.send("<script> alert('沒有此帳號喔，請您再次檢查'); window.location='/login' </script>");
            res.end();
		}
	});
});

router.post('/register', function(req, res, next) {
	User.find({ Username: req.body.name }, function(err, user, count) {
		if (user[0]) {
			res.send("<script> alert('此帳號已被註冊，請選一個新名字'); window.location='/register' </script>");
            res.end();
		}
		else {
			var user = req.body.user;
			var hash = crypto.createHash('sha256');
			hash.update(req.body.pwd);
			var Password = hash.digest('hex');
			var Email = req.body.email;
			new User({ Username: user, Password: Password, Email: Email })
				.save(function(err) {
					if (err) {
						console.log("Fail to Save to DB")
						next();
					}
					else
						console.log("Register Success!")
				})
			res.send("<script> alert('註冊成功'); window.location='/' </script>");
            res.end();
		}
    });
})

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
        res.send("<script> alert('您尚未登入喔\n請先登入後再來新增文章喔'); window.location='/' </script>");
        res.end();
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
        res.send("<script> alert('修改文章成功!'); window.location='/profile' </script>");
		res.end();
	}
	else {
        res.send("<script> alert('您尚未登入或文章ID錯誤\n請先登入後再來修改文章喔\n或是再檢查文章ID'); window.location='/' </script>");
        res.end();
    }
});

// Add comment to Database
router.post('/message', function(req, res, next) {
	if (req.body.articleID) {
		new Comment({ Visitor: req.body.visitor, Comment: req.body.Content, MessageID:req.body.articleID, CreateDate: Date.now() })
			.save(function(err) {
				if (err) {
					console.log("Fail to Save to DB")
					next();
				}
				console.log("Save to DB!")
			})
        res.send("<script> alert('新增留言成功'); window.location='/' </script>");
    	res.end();
	}
	else {
        res.send("<script> alert('文章ID有誤\n請再檢查文章ID!'); window.location='/' </script>");
        res.end();
    }
});

module.exports = router;
