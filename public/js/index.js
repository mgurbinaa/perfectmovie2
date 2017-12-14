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
	data.open('POST', 'http://localhost:3000/PerfectMovie/getPosters');
	data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	data.send();
}