var express = require('express');
var router = express.Router();

module.exports = function(passport){

	router.get('/success', function(req, res){
		res.redirect('/');
	});

	router.get('/failure', function(req, res){
		res.redirect('/login');
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		console.log("signing out")
		req.logout();
		res.redirect('/');
	});

	return router;

};