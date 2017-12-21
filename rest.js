var mysql = require('mysql');
var path = require('path');
var express = require('express');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
	router.get('', function(req, res){
		router.use(express.static(__dirname));
		res.sendFile(path.normalize(__dirname + '/index.html'));
	});
	router.get('/discover', function(req, res){
		router.use(express.static(__dirname + '../../'));
		res.sendFile(path.normalize(__dirname + '/discover.html'));
	});

	router.post("/getPosters", function(req, res){
		var query = "SELECT * FROM movies ORDER BY RAND()";
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
		});
	});
	router.post("/getDiscover", function(req, res){
		var user = req.body.u;
		var fgen = req.body.g;
		var year = req.body.y;
		var rate = req.body.r;
		var y1 = parseInt(year - 5);
		var y2 = parseInt(year + 5);
		var r1 = parseInt(rate - 5);
		var r2 = parseInt(rate + 5);
		if(fgen=='null'){
			console.log("fg null");
			var query = "SELECT COUNT(*) as counted FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"');";
			connection.query(query, function(err, rows){
				if(err){
					res.json(err);
				}else{
					if(rows[0].counted == 0){
						var query = "SELECT * FROM movies ORDER BY RAND()";
						connection.query(query, function(err, rows){
							if(err){
								res.json(err);
							}else{
								res.json(rows);
							}
						});
					}else{
						query = "SELECT count(l.director) as counted, l.director as director, p.name as name from likes l inner join people p on l.director = p.idPerson where l.user = (select idUser from users where id = '"+user+"') group by director;";
						connection.query(query, function(err, rows){
							query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie (NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) AND (year BETWEEN "+y1+" AND "+y2+" OR rating BETWEEN "+r1+" AND "+r2+") OR director LIKE '%"+rows[0].name+"%' ORDER BY RAND();";
							connection.query(query, function(err, rows){
								if(err){
									res.json(err);
								}else{
									res.json(rows);	
								}
							});
						})
					}
				}
			});
		}else{
			console.log("fg not null");
			var query = "SELECT count(l.director) as counted, l.director as director, p.name as name from likes l inner join people p on l.director = p.idPerson where l.user = (select idUser from users where id = '"+user+"') group by director;";
			connection.query(query, function(err, rows){
				if(rows[0].length>0){
					query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) AND ((year BETWEEN "+y1+" AND "+y2+" OR rating BETWEEN "+r1+" AND "+r2+") AND (genre LIKE '%"+fgen+"%' OR director LIKE '%"+rows[0].name+"%')) ORDER BY RAND();";
					connection.query(query, function(err, rows){
						if(err){
							res.json(err);
						}else{
							res.json(rows);
						}
					});
				}else{
					query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) AND ((year BETWEEN "+y1+" AND "+y2+" OR rating BETWEEN "+r1+" AND "+r2+") AND genre LIKE '%"+fgen+"%') ORDER BY RAND();";
					connection.query(query, function(err, rows){
						if(err){
							res.json(err);
						}else{
							res.json(rows);
						}
					});
				}
			});
		}
	});
	router.post("/getLikes", function(req, res){
		var user = req.body.u;
		var query = "SELECT * FROM movies WHERE idMovie IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"'))";
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
		});
	});
	router.post("/login", function(req, res){
		var user = req.body.u;
		var name = req.body.n;
		var query = "SELECT count(*) FROM users WHERE id = '"+user+"';";
		connection.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				if(rows[0].count == 1){
					res.json({login: true});
				}else{
					var query = "INSERT INTO users(id, name) VALUES('"+user+"', '"+name+"');";
					connection.query(query, function(err, rows){
						if(err){
							res.json({err: true});
						}else{
							res.json({login: true});
						}
					});
				}
			}
		});
	});
	router.post("/like", function(req, res){
		var user = req.body.u;
		var movie = req.body.m;
		console.log(user);
		console.log(movie);
		var query = "SELECT * FROM movies WHERE idMovie = '"+movie+"';";
		console.log(query);
		connection.query(query, function(err, rows){
			if(err){
				console.log(err);
				res.json({err: true});
			}else{
				if(Array.isArray(rows)){
					var dir = rows[0].director;
					query = "SELECT * FROM users WHERE id='"+user+"';";
					console.log(query);
					connection.query(query, function(err, rows){
						if(err){
							console.log(err);
							res.json({err:true});
						}else{
							if(Array.isArray(rows)){
								var us = rows[0].idUser;
								query = "INSERT INTO likes(movie, user, director) SELECT "+movie+", "+us+", idPerson FROM people WHERE name = '"+dir+"';";
								console.log(query);
								connection.query(query, function(err, rows){
									if(err){
										query = "INSERT INTO people(name) VALUES('"+dir+"');";
										connection.query(query, function(err, rows){
											if(err){
												console.log(err);
												res.json({err: true});
											}else{
												query = "INSERT INTO likes(movie, user, director) SELECT "+movie+", "+us+", idPerson FROM people WHERE name = '"+dir+"';";
												console.log(query);
												connection.query(query, function(err, rows){
													if(err){
														console.log(error);
														res.json({err:true});
													}else{
														res.json({like:true});
													}
												});
											}
										});
									}else{
										res.json({like:true});
									}
								});
							}
						}
					});
				}
			}
		});
	});
}

module.exports = REST_ROUTER;