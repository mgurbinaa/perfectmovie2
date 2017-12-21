var genres = [];
var ratings = [];
var years = [];

function getPosters(){
	var user = localStorage.getItem('user');
	var div = document.getElementById('posters');
	var fg = localStorage.getItem('fg');
	var r = localStorage.getItem('r');
	var y = localStorage.getItem('y');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if((this.status == 200 || this.status == 304) && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			console.log(datos);
			if(!datos.err){
				datos.length>50 ? limit = 50 : limit = datos.length;
				for(var i=0; i<limit; i++){
					var poster = '<div class="poster">';
					poster += "<img class='imgPoster' src='"+datos[i].image+"'>";
					poster += "<div class='like' href='#' id='"+datos[i].idMovie+"' onclick='like("+datos[i].idMovie+")'>";
					poster += "<img src='public/img/liked.png'></div>";
					poster += "<div class='share' href='#' id='"+datos[i].idMovie+"' onclick='share("+datos[i].idMovie+")'>";
					poster += "<img src='public/img/share.png'></div>";
					poster += "<p class='title'>"+datos[i].title+"</p>";
					poster += "<p class='metadata'>"+datos[i].year +" | "+datos[i].genre +" | "+datos[i].rating;
					poster +="</p></div>";
					div.innerHTML += poster;
				}
			}
		}
	};
	data.open('POST', 'http://'+location.host+'/getDiscover');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send('u='+user+'&g='+fg+'&r='+r+'&y='+y);
}

function getLikes(){
	var div = document.getElementById('likes');
	var user = localStorage.getItem('user');
	genres = [];
	ratings = [];
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if((this.status == 200 || this.status == 304) && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<datos.length; i++){
					genres.push(datos[i].genre);
					ratings.push(datos[i].rating);
					years.push(datos[i].year);
					var poster = '<div class="posterLiked">';
					poster += "<img class='imgPosterLiked' src='"+datos[i].image+"'>";
					poster +="</div>";
					div.innerHTML += poster;
				}
			}
			getFavGenre();
			getMidRating();
			getMidYear();
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
    for(var i = 0; i < genres.length; i++){
        var el = genres[i];
        if(modeMap[el] == null){
            modeMap[el] = 1;
        }else{
            modeMap[el]++;
        }

        if(modeMap[el] > maxCount){
            maxEl = el;
            maxCount = modeMap[el];
        }else if(modeMap[el] == maxCount){
        	maxEl = null;
        }
    }
    localStorage.setItem('fg', maxEl);
}

function getMidYear(){
	if(years.length==0){
		return null;
	}
	var sum = 0;
	for(var i=0; i<years.length; i++){
		sum+=years[i];
		prom=parseInt(sum/parseInt(i+1));
	}
	localStorage.setItem('y', prom);
}

function getMidRating(){
	if(ratings.length==0){
		return null;
	}
	var sum = 0;
	for(var i=0; i<ratings.length; i++){
		sum+=ratings[i];
		prom=parseInt(sum/parseInt(i+1));
	}
	localStorage.setItem('r', prom);
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


		
