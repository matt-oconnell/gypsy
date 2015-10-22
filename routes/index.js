var express = require('express');
var router = express.Router();
var graph = require('fbgraph');
var conf = require('../conf.js');

graph.setVersion("2.4");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {title: 'test'});
});

router.get('/redirect', function(req, res, next) {
	res.render('index', {title: 'test'});
});

router.get('/auth/facebook', function(req, res) {

	// we don't have a code yet
	// so we'll redirect to the oauth dialog
	if(!req.query.code) {
		var authUrl = graph.getOauthUrl({
			"client_id": conf.client_id
			, "redirect_uri": conf.redirect_uri
			, "scope": conf.scope
		});

		if(!req.query.error) { //user denied
			res.redirect(authUrl);
		} else {  //req.query.error == 'access_denied'
			res.send('access denied');
		}
		return;
	}

	// code is set
	// we'll send that and get the access token
	graph.authorize({
		"client_id": conf.client_id
		, "redirect_uri": conf.redirect_uri
		, "client_secret": conf.client_secret
		, "code": req.query.code
	}, function(err, facebookRes) {
		res.redirect('/UserHasLoggedIn');
	});

});

// user gets sent here after being authorized
router.get('/UserHasLoggedIn', function(req, res) {
	var page = res;
	graph.get("/7030462319/feed?fields=picture,attachments,comments,caption,description,admin_creator,created_time,from,message&limit=250&show_expired=true", function(err, res) {
		var posts = res.data;
		renderPage(page, posts);
		//var count = 0;
		//var recurse = function(res) {
		//	graph.get(res.paging.next, {limit:250}, function(err, res) {
		//		posts.concat(res.data);
		//		count++;
		//		console.log(count);
		//		if(res.paging && res.paging.next && count < 5) {
		//			recurse(res);
		//		} else {
		//			renderPage(page, posts);
		//		}
		//	});
		//};
		//recurse(res);
	});
});

function renderPage(page, posts){
	page.render("index", {posts: posts});
}

module.exports = router;