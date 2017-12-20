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
    statusChangeCallback(response);
    if(response.status === 'connected'){
      localStorage.setItem('user', response.mail);
      localStorage.setItem('name', response.name);
    }
  });
}


FB.login(function(response){
  alert(response.name);
  if(response.status === 'connected'){
    localStorage.setItem('user', response.mail);
    localStorage.setItem('name', response.name)
  }else{

  }
});

function onButtonClick() {
  // Add this to a button's onclick handler
  FB.AppEvents.logEvent("sentFriendRequest");
}
  