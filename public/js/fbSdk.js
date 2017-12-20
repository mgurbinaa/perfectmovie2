  window.fbAsyncInit = function() {
    FB.init({
      appId      : '527488130923668',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.10'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    if(response.status == 'connected'){
      dataRequest();
    }
    else{
      FB.login(function(response){
        if(response.status === 'connected'){
          dataRequest();
        }
      });
    }
  });
}

function dataRequest(){
FB.api('/me', 
        {fields: "email, name"}, 
        function(response) {
          localStorage.setItem('user', response.email);
          localStorage.setItem('name', response.name);
          entrar();
        }
    );
}

function entrar(){
  var user = localStorage.getItem('user');
  var name = localStorage.getItem('name');
  var data = new XMLHttpRequest();
  data.onreadystatechange = function(){
    if(this.status == 200 && this.readyState == 4){
      var datos = JSON.parse(this.responseText);
      if(!datos.err){
        window.location('http://'+location.host+'/discover');
      }
    }
  };
  data.open('POST', 'http://'+location.host+'/login');
  data.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  data.send('u='+user+'&n='+name);
}


function onButtonClick() {
  // Add this to a button's onclick handler
  FB.AppEvents.logEvent("sentFriendRequest");
}
  