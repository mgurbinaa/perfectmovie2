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
        }
    );
}




function onButtonClick() {
  // Add this to a button's onclick handler
  FB.AppEvents.logEvent("sentFriendRequest");
}
  