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
		var fgenre = req.body.g;
		if(fgenre=='null'){
			console.log("fg null");
			var query = "SELECT COUNT(*) as counted FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"');";
			connection.query(query, function(err, rows){
				if(err){
					console.log("Error al contar likes");
					console.log(err);
					res.json(err);
				}else{
					console.log(rows[0].counted+'[0]conteo likes');
					console.log(rows.counted+'rows conteo likes');
					if(rows[0].counted == 0){
						var query = "SELECT * FROM movies ORDER BY RAND()";
						connection.query(query, function(err, rows){
							if(err){
								console.log("Error al obtener TODAS las peliculas");
								console.log(err);
								res.json(err);
							}else{
								console.log("Obtiene TODAS las películas");
								res.json(rows);
							}
						});
					}else{
						console.log("Sí hay likes");
						query = "SELECT count(l.director) as counted, l.director as director, p.name as name from likes l inner join people p on l.director = p.idPerson where l.user = (select idUser from users where id = '"+user+"') group by director;";
						connection.query(query, function(err, rows){
							query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) OR director LIKE '%"+rows[0].name+"%' ORDER BY RAND();";
							connection.query(query, function(err, rows){
								if(err){
									console.log("Error al obtener peliculas con likes");
									console.log(err);
									res.json(err);
								}else{
									console.log("Obtiene las películas sólo con likes");
									res.json(rows);	
								}
							});
						})
					}
				}
			});
		}else{
			console.log("fg not null");
			var query = "SELECT count(l.director) as counted, l.director as director, p.name as name from likes l inner join people p on l.director = p.idPerson where l.user = (select idUser from users where id = '"+user+"') group by director ORDER BY RAND()";
			connection.query(query, function(err, rows){
				console.log(rows);
				console.log(rows[0].count+'[0]f');
				console.log(rows.count+'rowsf');
				if(rows[0].length>0){
					query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) AND (genre LIKE '%"+fgenre+"%' OR director LIKE '%"+rows[0].name+"%');";
					connection.query(query, function(err, rows){
						if(err){
							res.json(err);
						}else{
							res.json(rows);
						}
					});
				}else{
					query = "SELECT title, image, idMovie, director, genre, year, rating FROM movies WHERE idMovie NOT IN (SELECT movie FROM likes WHERE user = (SELECT idUser FROM users WHERE id = '"+user+"')) AND genre LIKE '%"+fgenre+"%' ORDER BY RAND();";
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
							res.json({login: true});
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
					var dir = rows[0].director.split(',');
					query = "SELECT * FROM users WHERE id='"+user+"';";
					console.log(query);
					connection.query(query, function(err, rows){
						if(err){
							console.log(err);
							res.json({err:true});
						}else{
							if(Array.isArray(rows)){
								var us = rows[0].idUser;
								query = "INSERT INTO likes(movie, user, director) SELECT "+movie+", "+us+", idPerson FROM people WHERE name = '"+dir[0]+"';";
								console.log(query);
								connection.query(query, function(err, rows){
									if(err){
										query = "INSERT INTO people(name) VALUES('"+dir[0]+"');";
										connection.query(query, function(err, rows){
											if(err){
												console.log(err);
												res.json({err: true});
											}else{
												query = "INSERT INTO likes(movie, user, director) SELECT "+movie+", "+us+", idPerson FROM people WHERE name = '"+dir[0]+"';";
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