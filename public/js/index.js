function getPosters(){
	var div = document.getElementById('posters');
	var data = new XMLHttpRequest();
	data.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == 4){
			var datos = JSON.parse(this.responseText);
			if(!datos.err){
				for(var i=0; i<40; i++){
					var poster = '<div class="poster">';
					poster += "<img class='imgPoster' src='"+datos[i].image+"'></div>";
					div.innerHTML += poster;
				}
			}
		}
	};
	data.open('POST', 'http://'+location.host+'/getPosters');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send();
}

function load(){
	var user = localStorage.getItem('user');
	if(user != null){
		login();
	}
	getPosters();
}

function entrar(){
	var user = localStorage.getItem('user');
    var name = localStorage.getItem('name');
    if(user != null){
	    var data = new XMLHttpRequest();
	    data.onreadystatechange = function(){
	      	if(this.status == 200 && this.readyState == 4){
	          	alert("Entró al if");
	          	var datos = JSON.parse(this.responseText);
	          	if(!datos.err){
	            	alert("No hubo error");
	            	location.assign('http://'+location.host+'/discover')
	          	}
	        }
	    };
	    data.open('POST', 'http://'+location.host+'/login');
	    data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	    data.send('u='+user+'&n='+name);
	}
}

function discover(){
	location.assign('http://'+location.host+'/discover');
}