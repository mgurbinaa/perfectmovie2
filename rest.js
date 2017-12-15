var mysql = require('mysql');
var path = require('path');
var express = require('express');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
	router.get('/PerfectMovie2', function(req, res){
		router.use(express.static(__dirname));
		res.sendFile(path.normalize(__dirname + '/index.html'));
	});
	router.get('/PerfectMovie2/discover', function(req, res){
		router.use(express.static(__dirname + '../../'));
		res.sendFile(path.normalize(__dirname + '/discover.html'));
	});

	router.post("/PerfectMovie2/getPosters", function(req, res){
		var query = "SELECT * FROM movies";
		connection.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				if(Array.isArray(rows)){
					res.json(rows);
				}else{
					console.log(rows);
					res.json({err:true});
				}
			}
		})
	})
	router.post("/PerfectMovie2/getLikes", function(req, res){
		var user = req.body.u;
		var query = "SELECT * FROM movies WHERE idMovie = (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = "+user+"))";
		connection.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				if(Array.isArray(rows)){
					res.json(rows);
				}else{
					console.log(rows);
					res.json({err:true});
				}
			}
		})
	})
	router.post("/PerfectMovie2/login", function(req, res){
		var user = req.body.u;
		var name = req.body.n;
		var query = "SELECT * FROM users WHERE userId = "+user;
		connection.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				if(Array.isArray(rows)){
					res.json({login: true});
				}else{
					var query = "INSERT INTO users(id, name) VALUES('"+user+"', '"+name+"');";
					connection.query(query, function(err, rows){
						if(err){
							console.log(err);
							res.json({err: true});
						}else{
							res.json({login: true});
						}
					})
				}
			}
		})
	})
	router.post("/PerfectMovie2/like", function(req, res){
		var user = req.body.u;
		var movie = req.body.m;
		var director = req.body.d;
		director = director.split(',');
		var query = "INSERT INTO likes(movie, user, director) VALUES('"+movie+"', '"+user+"', '"+director[0]+"');";
		connecion.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				res.json({like: true});
			}
		})
	})
}

module.exports = REST_ROUTER;