window.fbAsyncInit = function() {
  FB.init({
    appId      : '{527488130923668}',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.10'
  });
    
  FB.AppEvents.logPageView();   
    
};

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.11&appId=527488130923668';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

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
  