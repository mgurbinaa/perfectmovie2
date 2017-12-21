var genres = [];

function getPosters(){
	var user = localStorage.getItem('user');
	var div = document.getElementById('posters');
	var fg = localStorage.getItem('fg');
	alert(fg);
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if((this.status == 200 || this.status == 304) && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<50; i++){
					console.log(datos);
					var poster = '<div class="poster">';
					poster += "<img class='imgPoster' src='"+datos[i].image+"'>";
					poster += "<div class='like' href='#' id='"+datos[i].idMovie+"' onclick='like("+datos[i].idMovie+")'>";
					poster += "<img src='public/img/liked.png'><p class='textLike'>Like</p></div>";
					poster += "<p class='title'>"+datos[i].title+"</p>";
					var genres = datos[i].genre.split(',');
					poster += "<p class='metadata'>"+datos[i].year +" | "+datos[i].genre +" | "+datos[i].rating;
					poster +="</p></div>";
					div.innerHTML += poster;
				}
			}
		}
	};
	data.open('POST', 'http://'+location.host+'/getDiscover');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user+'&g='+fg);
}

function getLikes(){
	var div = document.getElementById('likes');
	var user = localStorage.getItem('user');
	genres = [];
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if((this.status == 200 || this.status == 304) && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<datos.length; i++){
					generos = datos[i].genre.split(', ');
					for(j=0; j<generos.length-1; j++){
						genres.push(generos[j]);
					}
					var poster = '<div class="posterLiked">';
					poster += "<img class='imgPosterLiked' src='"+datos[i].image+"'>";
					poster +="</div>";
					div.innerHTML += poster;
				}
			}
			getFavGenre();
		}
	};
	data.open('POST', 'http://'+location.host+'/getLikes');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user);
}

function getFavGenre(){
	if(genres.length == 0){
        return null;
	}
    var modeMap = {};
    var maxEl = genres[0], maxCount = 1;
    for(var i = 0; i < genres.length; i++)
    {
        var el = genres[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] >= maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    localStorage.setItem('fg', maxEl);
}

function load(){
	var user = localStorage.getItem('user');
	if(user == null){
		location.assign('http://'+location.host+'');
	}
	getPosters();
	getLikes();
}


function like(movie){
	var user = localStorage.getItem('user');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if((this.status == 200 || this.status == 304) && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				window.location.reload(false);
			}
		}
	};
	data.open('POST', 'http://'+location.host+'/like');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user+'&m='+movie);
}


		
