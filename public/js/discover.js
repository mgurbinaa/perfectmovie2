function getPosters(){
	var user = localStorage.getItem('user');
	var div = document.getElementById('posters');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<50; i++){
					var poster = '<div class="poster">';
					poster += "<img class='imgPoster' src='"+datos[i].image+"'>";
					poster += "<div class='like' id='"+datos[i].idMovie+"' onclick='like("+datos[i].idMovie+", "+datos[i].director+")'' >";
					poster += "<img src='public/img/liked.png'><p class='textLike'>Like</p></div>";
					poster += "<p class='title'>"+datos[i].title+"</p>";
					var genres = datos[i].genre.split(',');
					poster += "<p class='metadata'>"+datos[i].year;
					for(var j=0; j<genres.length-1; j++){
						poster += " | "+genres[j];
					}
					poster +="</div>";
					div.innerHTML += poster;
				}
			}
		}
	};
	data.open('POST', 'http://localhost:3000/perfectmovie2/getDiscover');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user);
}

function getLikes(){
	var div = document.getElementById('likes');
	var user = localStorage.getItem('user');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<50; i++){
					var poster = '<div class="posterLiked">';
					poster += "<img class='imgPosterLiked' src='"+datos[i].image+"'>";
					poster +="</div>";
					div.innerHTML += poster;
				}
			}
		}
	};
	data.open('POST', 'http://localhost:3000/perfectmovie2/getLikes');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user);
}

function load(){
	var user = localStorage.getItem('user');
	if(user == null){
		location.assign('http://'+location.host+'/perfectmovie2');
	}
	getPosters();
	getLikes();
}


function like(movie, director){
	var user = localStorage.getItem('user');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				location.assign('http://'+location.host+'/perfectmovie2');
			}
		}
	};
	data.open('POST', 'http://localhost:3000/perfectmovie2/like');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user+'&m='+movie+'&d='+director);
}