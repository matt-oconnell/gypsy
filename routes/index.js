var express = require('express');
var router = express.Router();
var graph = require('fbgraph');
var conf = require('../conf.js');

graph.setVersion('2.4');

router.get('/', function(req, res) {
	res.render('index', {title: 'test'});
});

router.get('/generate', function(req, res) {

	if(!req.query.code) {
		var authUrl = graph.getOauthUrl({
			'client_id': conf.client_id,
			'redirect_uri': conf.redirect_uri,
			'scope': conf.scope
		});

		if(!req.query.error) {
			res.redirect(authUrl);
		} else {
			res.send('access denied');
		}
		return;
	}

	graph.authorize({
		'client_id': conf.client_id,
		'redirect_uri': conf.redirect_uri,
		'client_secret': conf.client_secret,
		'code': req.query.code
	}, function() {
		res.redirect('/list');
	});

});

router.get('/list', function(req, res) {
	var page = res;
	graph.get('/7030462319/feed?fields=picture,attachments,comments,caption,description,admin_creator,created_time,from,message&limit=250&show_expired=true', function(err, res) {
		var posts = res.data;
		page.render('list', {posts: posts});
	});
});

module.exports = router;