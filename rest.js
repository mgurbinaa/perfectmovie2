var mysql = require('mysql');
var path = require('path');
var express = require('express');

function REST_ROUTER(router, connection, md5) {
	var self = this;
	self.handleRoutes(router, connection, md5);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, md5) {
	router.get('/PerfectMovie', function(req, res){
		router.use(express.static(__dirname));
		res.sendFile(path.normalize(__dirname + '/index.html'));
	});

	router.post("/PerfectMovie/getPosters", function(req, res){
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
}

module.exports = REST_ROUTER;